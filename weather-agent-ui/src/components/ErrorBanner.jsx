import React, { useEffect } from 'react'

export default function ErrorBanner({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div style={{
      width: '100%',
      background: '#FFF0ED',
      border: '1px solid #FFD0C5',
      borderRadius: 12,
      padding: '11px 15px',
      fontSize: 14,
      color: 'var(--coral)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 12,
      animation: 'slideIn 0.3s ease both',
    }}>
      <span>⚠ {message}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--coral)',
          fontSize: 16, lineHeight: 1, padding: 2,
          flexShrink: 0,
        }}
      >✕</button>
    </div>
  )
}
