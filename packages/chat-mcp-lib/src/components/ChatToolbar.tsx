import { useState } from 'react';
import { MCPTool } from '../types/mcp-protocol';

export interface ChatToolbarProps {
  onClearChat: () => void;
  onRegisterTool: (tool: MCPTool) => void;
  onUnregisterTool: (toolName: string) => void;
  tools: MCPTool[];
  isLoading: boolean;
}

export function ChatToolbar({
  onClearChat,
  onRegisterTool,
  onUnregisterTool,
  tools,
  isLoading,
}: ChatToolbarProps): React.ReactElement {
  const [showToolsPanel, setShowToolsPanel] = useState(false);

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      onClearChat();
    }
  };

  const handleUnregisterTool = (toolName: string) => {
    if (confirm(`Are you sure you want to unregister the tool "${toolName}"?`)) {
      onUnregisterTool(toolName);
    }
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      {/* Left side - Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: isLoading ? '#f59e0b' : '#10b981',
            borderRadius: '50%',
            animation: isLoading ? 'pulse 2s infinite' : 'none',
          }}
        />
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
          ChatMcp
        </span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {tools.length} tool{tools.length !== 1 ? 's' : ''} registered
        </span>
      </div>

      {/* Right side - Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Tools Panel Toggle */}
        <button
          onClick={() => setShowToolsPanel(!showToolsPanel)}
          style={{
            padding: '6px 12px',
            backgroundColor: showToolsPanel ? '#3b82f6' : '#ffffff',
            color: showToolsPanel ? '#ffffff' : '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!showToolsPanel) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!showToolsPanel) {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Tools
        </button>

        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ffffff',
            color: '#ef4444',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: isLoading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#fef2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
          </svg>
          Clear
        </button>
      </div>

      {/* Tools Panel */}
      {showToolsPanel && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '16px',
            width: '320px',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            padding: '16px',
            marginTop: '4px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              Registered Tools
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
              Tools available for the AI assistant to use
            </p>
          </div>

          {tools.length === 0 ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '12px',
              }}
            >
              No tools registered yet
            </div>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
                        {tool.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                        {tool.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnregisterTool(tool.name)}
                      style={{
                        padding: '4px 6px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        marginLeft: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ef4444';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}