// React import not needed with new JSX transform
import { ChatMessage } from '../types/mcp-protocol';

export interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export function ChatMessages({
  messages,
  isLoading,
  error,
}: ChatMessagesProps): React.ReactElement {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isTool = message.role === 'tool';

    return (
      <div
        key={message.id}
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: isUser
              ? '#3b82f6'
              : isSystem
              ? '#6b7280'
              : isTool
              ? '#059669'
              : '#ffffff',
            color: isUser || isSystem || isTool ? '#ffffff' : '#1f2937',
            border: !isUser && !isSystem && !isTool ? '1px solid #e5e7eb' : 'none',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Message Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: message.role === 'user' ? '0' : '8px',
              fontSize: '12px',
              opacity: 0.8,
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {message.role === 'user'
                ? 'You'
                : message.role === 'assistant'
                ? 'Assistant'
                : message.role === 'system'
                ? 'System'
                : message.role === 'tool'
                ? 'Tool'
                : message.role}
            </span>
            <span>{formatTimestamp(message.createdAt)}</span>
          </div>

          {/* Message Content */}
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: '1.5',
            }}
          >
            {message.content}
          </div>

          {/* Tool Calls */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Tool Calls:
              </div>
              {message.toolCalls.map((toolCall, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {toolCall.function.name}
                  </span>
                  <span style={{ marginLeft: '8px', opacity: 0.8 }}>
                    {toolCall.function.arguments}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tool Call ID for tool messages */}
          {message.toolCallId && (
            <div
              style={{
                marginTop: '4px',
                fontSize: '10px',
                opacity: 0.6,
              }}
            >
              Tool Call ID: {message.toolCallId}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '200px' }}>
      {/* Welcome Message */}
      {messages.length === 0 && !isLoading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>
            💬 Welcome to ChatMcp
          </div>
          <div>Start a conversation with the AI assistant</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Error:
          </div>
          {error}
        </div>
      )}

      {/* Messages */}
      {messages.map(renderMessage)}

      {/* Loading Indicator */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite 0.5s',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite 1s',
                }}
              />
              <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                Assistant is typing...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}