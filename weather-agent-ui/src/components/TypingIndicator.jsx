import React from 'react'

export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      animation: 'slideIn 0.3s ease both',
    }}>
      <div style={{
        width: 34, height: 34,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        background: 'linear-gradient(135deg, #7B9EF8, #2B4AB7)',
        color: 'white',
        boxShadow: '0 3px 10px rgba(43,74,183,0.25)',
        flexShrink: 0,
      }}>
        ☁
      </div>
      <div style={{
        display: 'flex',
        gap: 5,
        background: 'white',
        border: '1px solid rgba(197,213,255,0.45)',
        borderRadius: 14,
        padding: '13px 17px',
        boxShadow: 'var(--shadow)',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: 'var(--breeze)',
              animation: `bounce 1.2s ease infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
