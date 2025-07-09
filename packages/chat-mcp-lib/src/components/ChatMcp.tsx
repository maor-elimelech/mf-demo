import React, { useEffect, useRef } from 'react';
import { useChatMcp, UseChatMcpOptions } from '../hooks/useChatMcp';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatToolbar } from './ChatToolbar';
import { ChatMcpConfig, MCPTool, ChatState } from '../types/mcp-protocol';

export interface ChatMcpProps {
  config: ChatMcpConfig;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  showToolbar?: boolean;
  maxHeight?: string;
  onStateChange?: (state: ChatState) => void;
  onToolRegister?: (tool: MCPTool) => void;
  onToolUnregister?: (toolName: string) => void;
}

export function ChatMcp({
  config,
  className = '',
  style,
  placeholder = 'Type your message...',
  showToolbar = true,
  maxHeight = '600px',
  onStateChange,
  onToolRegister,
  onToolUnregister,
}: ChatMcpProps): React.ReactElement {
  const chatOptions: UseChatMcpOptions = {
    config,
    onStateChange,
  };

  const {
    messages,
    input,
    isLoading,
    error,
    sendMessage,
    setInput,
    clearChat,
    registerTool,
    unregisterTool,
    getTools,
    on,
    mcpClient,
  } = useChatMcp(chatOptions);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle tool registration events
  useEffect(() => {
    if (onToolRegister) {
      const handleToolRegister = (tool: MCPTool) => {
        onToolRegister(tool);
      };
      
      // Listen for tool registration events
      on('toolCall', (toolCall) => {
        const tool = mcpClient.getTool(toolCall.function.name);
        if (tool) {
          handleToolRegister(tool);
        }
      });
    }
  }, [onToolRegister, on, mcpClient]);

  // Handle tool unregistration events
  useEffect(() => {
    if (onToolUnregister) {
      // This would need to be implemented in the MCP client
      // For now, we'll just call it directly when unregisterTool is called
    }
  }, [onToolUnregister]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  const handleClearChat = () => {
    clearChat();
  };

  const handleRegisterTool = (tool: MCPTool) => {
    registerTool(tool);
    if (onToolRegister) {
      onToolRegister(tool);
    }
  };

  const handleUnregisterTool = (toolName: string) => {
    unregisterTool(toolName);
    if (onToolUnregister) {
      onToolUnregister(toolName);
    }
  };

  return (
    <div
      className={`chat-mcp-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight,
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        ...style,
      }}
    >
      {/* Toolbar */}
      {showToolbar && (
        <ChatToolbar
          onClearChat={handleClearChat}
          onRegisterTool={handleRegisterTool}
          onUnregisterTool={handleUnregisterTool}
          tools={getTools()}
          isLoading={isLoading}
        />
      )}

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          backgroundColor: '#f8fafc',
        }}
      >
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Input Area */}
      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <ChatInput
          value={input}
          onChange={setInput}
          onSendMessage={handleSendMessage}
          placeholder={placeholder}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}