// Removed unused uuid import
import {
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPError,
  MCPErrorCode,
  MCPRequest,
  MCPResponse,
  ChatMcpEvents,
  ChatMcpEventName,
  ChatMcpEventHandler,
} from '../types/mcp-protocol';

export class MCPClient {
  private tools: Map<string, MCPTool> = new Map();
  private eventListeners: Map<ChatMcpEventName, Set<Function>> = new Map();
  private requestId = 0;

  constructor() {
    // Initialize event listeners maps
    Object.keys({} as ChatMcpEvents).forEach((eventName) => {
      this.eventListeners.set(eventName as ChatMcpEventName, new Set());
    });
  }

  /**
   * Register a tool with the MCP client
   */
  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Unregister a tool from the MCP client
   */
  unregisterTool(toolName: string): void {
    this.tools.delete(toolName);
  }

  /**
   * Get all registered tools
   */
  getTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get a specific tool by name
   */
  getTool(toolName: string): MCPTool | undefined {
    return this.tools.get(toolName);
  }

  /**
   * Execute a tool call
   */
  async executeToolCall(toolCall: MCPToolCall): Promise<MCPToolResult> {
    const tool = this.tools.get(toolCall.function.name);
    
    if (!tool) {
      const error: MCPError = {
        code: MCPErrorCode.MethodNotFound,
        message: `Tool '${toolCall.function.name}' not found`,
      };
      this.emit('error', error);
      return {
        content: [{ type: 'text', text: error.message }],
        isError: true,
      };
    }

    try {
      // Parse arguments
      let params: Record<string, unknown>;
      try {
        params = JSON.parse(toolCall.function.arguments);
      } catch (parseError) {
        const error: MCPError = {
          code: MCPErrorCode.InvalidParams,
          message: 'Invalid JSON in tool arguments',
          data: parseError,
        };
        this.emit('error', error);
        return {
          content: [{ type: 'text', text: error.message }],
          isError: true,
        };
      }

      // Validate parameters against schema
      const validationError = this.validateParams(params, tool.inputSchema);
      if (validationError) {
        this.emit('error', validationError);
        return {
          content: [{ type: 'text', text: validationError.message }],
          isError: true,
        };
      }

      // Emit tool call event
      this.emit('toolCall', toolCall);

      // Execute tool
      const result = await tool.handler(params);
      
      // Emit tool result event
      this.emit('toolResult', result);
      
      return result;
    } catch (executionError) {
      const error: MCPError = {
        code: MCPErrorCode.ToolExecutionError,
        message: `Tool execution failed: ${executionError instanceof Error ? executionError.message : 'Unknown error'}`,
        data: executionError,
      };
      this.emit('error', error);
      return {
        content: [{ type: 'text', text: error.message }],
        isError: true,
      };
    }
  }

  /**
   * Validate parameters against tool schema
   */
  private validateParams(params: Record<string, unknown>, schema: MCPTool['inputSchema']): MCPError | null {
    // Check required parameters
    if (schema.required) {
      for (const requiredParam of schema.required) {
        if (!(requiredParam in params)) {
          return {
            code: MCPErrorCode.InvalidParams,
            message: `Missing required parameter: ${requiredParam}`,
          };
        }
      }
    }

    // Basic type validation
    for (const [paramName, paramValue] of Object.entries(params)) {
      const paramSchema = schema.properties[paramName];
      if (!paramSchema) {
        continue; // Unknown parameter, skip validation
      }

      const actualType = typeof paramValue;
      const expectedType = paramSchema.type;

      if (expectedType === 'object' && actualType !== 'object') {
        return {
          code: MCPErrorCode.InvalidParams,
          message: `Parameter '${paramName}' must be of type object`,
        };
      }

      if (expectedType === 'array' && !Array.isArray(paramValue)) {
        return {
          code: MCPErrorCode.InvalidParams,
          message: `Parameter '${paramName}' must be an array`,
        };
      }

      if (expectedType === 'string' && actualType !== 'string') {
        return {
          code: MCPErrorCode.InvalidParams,
          message: `Parameter '${paramName}' must be of type string`,
        };
      }

      if (expectedType === 'number' && actualType !== 'number') {
        return {
          code: MCPErrorCode.InvalidParams,
          message: `Parameter '${paramName}' must be of type number`,
        };
      }

      if (expectedType === 'boolean' && actualType !== 'boolean') {
        return {
          code: MCPErrorCode.InvalidParams,
          message: `Parameter '${paramName}' must be of type boolean`,
        };
      }
    }

    return null;
  }

  /**
   * Create a JSON-RPC request
   */
  createRequest(method: string, params?: Record<string, unknown>): MCPRequest {
    return {
      jsonrpc: "2.0",
      id: ++this.requestId,
      method,
      params,
    };
  }

  /**
   * Create a JSON-RPC response
   */
  createResponse(id: string | number, result?: Record<string, unknown>, error?: MCPError): MCPResponse {
    return {
      jsonrpc: "2.0",
      id,
      result,
      error,
    };
  }

  /**
   * Convert registered tools to OpenAI-compatible format
   */
  getToolsForOpenAI(): Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: MCPTool['inputSchema'];
    };
  }> {
    return Array.from(this.tools.values()).map((tool) => ({
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));
  }

  /**
   * Add event listener
   */
  on<T extends ChatMcpEventName>(eventName: T, handler: ChatMcpEventHandler<T>): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.add(handler);
    }
  }

  /**
   * Remove event listener
   */
  off<T extends ChatMcpEventName>(eventName: T, handler: ChatMcpEventHandler<T>): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.delete(handler);
    }
  }

  /**
   * Emit event
   */
  private emit<T extends ChatMcpEventName>(eventName: T, ...args: Parameters<ChatMcpEventHandler<T>>): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((handler) => {
        try {
          (handler as any)(...args);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Clear all registered tools
   */
  clearTools(): void {
    this.tools.clear();
  }

  /**
   * Clear all event listeners
   */
  clearEventListeners(): void {
    this.eventListeners.forEach((listeners) => listeners.clear());
  }
} 