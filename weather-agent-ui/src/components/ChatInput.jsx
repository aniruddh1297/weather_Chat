import React, { useRef, useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const handleInput = (e) => {
    setValue(e.target.value)
    // auto-resize
    const ta = textareaRef.current
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
    const ta = textareaRef.current
    if (ta) ta.style.height = 'auto'
  }

  return (
    <div style={{
      width: '100%',
      background: 'white',
      border: `1.5px solid ${focused ? 'var(--breeze)' : 'var(--horizon)'}`,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      padding: '11px 12px 11px 18px',
      boxShadow: focused
        ? '0 8px 32px rgba(43,74,183,0.13), 0 0 0 4px rgba(123,158,248,0.11)'
        : '0 8px 32px rgba(43,74,183,0.08)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      animation: 'fadeUp 0.55s 0.3s ease both',
      animationFillMode: 'both',
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Ask about weather anywhere in the world…"
        rows={1}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: 15,
          color: 'var(--ink)',
          background: 'transparent',
          lineHeight: 1.55,
          minHeight: 24,
          maxHeight: 140,
          overflowY: 'auto',
        }}
      />
      <SendButton onClick={submit} disabled={disabled || !value.trim()} />
    </div>
  )
}

function SendButton({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Send"
      style={{
        width: 40, height: 40,
        borderRadius: 12,
        border: 'none',
        background: disabled
          ? 'var(--horizon)'
          : 'linear-gradient(135deg, #7B9EF8, #2B4AB7)',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.18s, box-shadow 0.18s, background 0.2s',
        transform: hovered && !disabled ? 'scale(1.08)' : 'scale(1)',
        boxShadow: hovered && !disabled
          ? '0 6px 20px rgba(43,74,183,0.42)'
          : disabled ? 'none' : '0 4px 14px rgba(43,74,183,0.32)',
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/>
        <path d="M22 2L15 22 11 13 2 9l20-7z"/>
      </svg>
    </button>
  )
}
