import React, { useState, useRef, useEffect } from 'react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxRows?: number;
}

export function ChatInput({
  value,
  onChange,
  onSendMessage,
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  maxRows = 4,
}: ChatInputProps): React.ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 20; // Approximate line height
      const newRows = Math.min(Math.max(1, Math.ceil(scrollHeight / lineHeight)), maxRows);
      setRows(newRows);
      textareaRef.current.style.height = `${newRows * lineHeight}px`;
    }
  }, [value, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (value.trim() && !disabled && !isLoading) {
      onSendMessage(value.trim());
      onChange('');
      setRows(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      style={{
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
      }}
    >
      {/* Text Input */}
      <div style={{ flex: 1 }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={rows}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            lineHeight: '20px',
            resize: 'none',
            outline: 'none',
            backgroundColor: disabled || isLoading ? '#f9fafb' : '#ffffff',
            color: disabled || isLoading ? '#6b7280' : '#1f2937',
            transition: 'all 0.15s ease-in-out',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        />
        
        {/* Keyboard Shortcut Hint */}
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'right',
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        disabled={!value.trim() || disabled || isLoading}
        style={{
          padding: '12px 20px',
          backgroundColor: !value.trim() || disabled || isLoading ? '#e5e7eb' : '#3b82f6',
          color: !value.trim() || disabled || isLoading ? '#9ca3af' : '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: !value.trim() || disabled || isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease-in-out',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          minWidth: '80px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading && value.trim()) {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading && value.trim()) {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
            <span>Send</span>
          </>
        )}
      </button>

      {/* Add CSS for spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}