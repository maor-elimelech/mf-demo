// MCP Protocol Types for Frontend Communication
// Following JSON-RPC 2.0 specification

export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: Record<string, unknown>;
  error?: MCPError;
}

export interface MCPNotification {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

// Standard MCP error codes
export enum MCPErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ToolNotFound = -32001,
  ToolExecutionError = -32002,
  PermissionDenied = -32003,
}

// Tool definition for MCP
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, MCPToolProperty>;
    required?: string[];
  };
  handler: (params: Record<string, unknown>) => Promise<MCPToolResult> | MCPToolResult;
}

export interface MCPToolProperty {
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  enum?: string[];
  default?: unknown;
}

export interface MCPToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Tool call from LLM
export interface MCPToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

// Chat configuration
export interface ChatMcpConfig {
  apiUrl: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: MCPTool[];
  onToolCall?: (toolCall: MCPToolCall) => Promise<MCPToolResult>;
}

// Message types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCallId?: string;
  toolCalls?: MCPToolCall[];
  createdAt: Date;
}

// Chat state
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  tools: MCPTool[];
}

// Events that can be emitted
export interface ChatMcpEvents {
  message: (message: ChatMessage) => void;
  toolCall: (toolCall: MCPToolCall) => void;
  toolResult: (result: MCPToolResult) => void;
  error: (error: MCPError) => void;
  stateChange: (state: ChatState) => void;
}

export type ChatMcpEventName = keyof ChatMcpEvents;
export type ChatMcpEventHandler<T extends ChatMcpEventName> = ChatMcpEvents[T]; 