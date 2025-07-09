import { useState, useRef, useCallback, useEffect } from 'react';
import { useChat } from 'ai/react';
import { v4 as uuidv4 } from 'uuid';
import { MCPClient } from '../lib/mcp-client';
import {
  ChatMcpConfig,
  ChatMessage,
  ChatState,
  MCPTool,
  ChatMcpEventName,
  ChatMcpEventHandler,
} from '../types/mcp-protocol';

export interface UseChatMcpOptions {
  config: ChatMcpConfig;
  initialMessages?: ChatMessage[];
  onStateChange?: (state: ChatState) => void;
}

export interface UseChatMcpReturn {
  // Chat state
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  
  // Chat actions
  sendMessage: (message: string) => void;
  setInput: (input: string) => void;
  clearChat: () => void;
  
  // Tool management
  registerTool: (tool: MCPTool) => void;
  unregisterTool: (toolName: string) => void;
  getTools: () => MCPTool[];
  
  // Event handling
  on: <T extends ChatMcpEventName>(eventName: T, handler: ChatMcpEventHandler<T>) => void;
  off: <T extends ChatMcpEventName>(eventName: T, handler: ChatMcpEventHandler<T>) => void;
  
  // MCP client instance
  mcpClient: MCPClient;
}

export function useChatMcp(options: UseChatMcpOptions): UseChatMcpReturn {
  const { config, initialMessages = [], onStateChange } = options;
  
  // Initialize MCP client
  const mcpClient = useRef<MCPClient>(new MCPClient());
  
  // Local state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  
  // Convert ChatMessage to Vercel AI SDK format
  
  // Convert Vercel AI SDK messages to ChatMessage format
  const convertFromVercelMessages = useCallback((vercelMessages: any[]): ChatMessage[] => {
    return vercelMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      toolCalls: msg.toolInvocations?.map((invocation: any) => ({
        id: invocation.toolCallId,
        type: 'function' as const,
        function: {
          name: invocation.toolName,
          arguments: JSON.stringify(invocation.args),
        },
      })),
      createdAt: new Date(),
    }));
  }, []);
  
  // Tool handling is now done on the backend through the API
  
  // Initialize Vercel AI SDK useChat
  const {
    messages: vercelMessages,
    input,
    handleSubmit,
    isLoading,
    setMessages: setVercelMessages,
    setInput: setVercelInput,
  } = useChat({
    api: config.apiUrl,
    headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : undefined,
    body: {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      tools: mcpClient.current.getToolsForOpenAI(),
    },
    onFinish: (message: any) => {
      // Convert and update local state
      const newMessages = convertFromVercelMessages([...vercelMessages, message]);
      setChatMessages(newMessages);
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });
  
  // Sync vercel messages with local state
  useEffect(() => {
    const newMessages = convertFromVercelMessages(vercelMessages);
    setChatMessages(newMessages);
  }, [vercelMessages, convertFromVercelMessages]);
  
  // Register initial tools
  useEffect(() => {
    if (config.tools) {
      config.tools.forEach(tool => {
        mcpClient.current.registerTool(tool);
      });
    }
  }, [config.tools]);
  
  // Handle state changes
  useEffect(() => {
    if (onStateChange) {
      const state: ChatState = {
        messages: chatMessages,
        isLoading,
        error,
        tools: mcpClient.current.getTools(),
      };
      onStateChange(state);
    }
  }, [chatMessages, isLoading, error, onStateChange]);
  
  // Chat actions
  const sendMessage = useCallback((message: string) => {
    setError(null);
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      createdAt: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Use Vercel AI SDK's submit with the message
    handleSubmit(new Event('submit') as any, { data: { message } });
  }, [handleSubmit]);
  
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setVercelMessages([]);
    setError(null);
  }, [setVercelMessages]);
  
  // Tool management
  const registerTool = useCallback((tool: MCPTool) => {
    mcpClient.current.registerTool(tool);
  }, []);
  
  const unregisterTool = useCallback((toolName: string) => {
    mcpClient.current.unregisterTool(toolName);
  }, []);
  
  const getTools = useCallback(() => {
    return mcpClient.current.getTools();
  }, []);
  
  // Event handling
  const on = useCallback(<T extends ChatMcpEventName>(
    eventName: T,
    handler: ChatMcpEventHandler<T>
  ) => {
    mcpClient.current.on(eventName, handler);
  }, []);
  
  const off = useCallback(<T extends ChatMcpEventName>(
    eventName: T,
    handler: ChatMcpEventHandler<T>
  ) => {
    mcpClient.current.off(eventName, handler);
  }, []);
  
  return {
    // Chat state
    messages: chatMessages,
    input,
    isLoading,
    error,
    
    // Chat actions
    sendMessage,
    setInput: setVercelInput,
    clearChat,
    
    // Tool management
    registerTool,
    unregisterTool,
    getTools,
    
    // Event handling
    on,
    off,
    
    // MCP client instance
    mcpClient: mcpClient.current,
  };
} 