// Main components
export { ChatMcp, type ChatMcpProps } from './components/ChatMcp';
export { ChatMessages, type ChatMessagesProps } from './components/ChatMessages';
export { ChatInput, type ChatInputProps } from './components/ChatInput';
export { ChatToolbar, type ChatToolbarProps } from './components/ChatToolbar';

// Hooks
export { useChatMcp, type UseChatMcpOptions, type UseChatMcpReturn } from './hooks/useChatMcp';

// MCP Client
export { MCPClient } from './lib/mcp-client';

// Types and interfaces
export type {
  // Core protocol types
  MCPRequest,
  MCPResponse,
  MCPNotification,
  MCPError,
  MCPToolCall,
  MCPToolResult,
  MCPTool,
  MCPToolProperty,
  
  // Chat types
  ChatMessage,
  ChatState,
  ChatMcpConfig,
  ChatMcpEvents,
  ChatMcpEventName,
  ChatMcpEventHandler,
} from './types/mcp-protocol';

// Constants
export { MCPErrorCode } from './types/mcp-protocol';