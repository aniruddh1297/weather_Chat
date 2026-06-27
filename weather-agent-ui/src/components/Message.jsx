import React from 'react'

function formatContent(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')
}

export default function Message({ message }) {
  const isAgent = message.role === 'agent'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      flexDirection: isAgent ? 'row' : 'row-reverse',
      animation: 'slideIn 0.4s ease both',
    }}>
      {/* Avatar */}
      <div style={{
        width: 34, height: 34,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isAgent ? 16 : 11,
        fontWeight: 500,
        flexShrink: 0,
        background: isAgent
          ? 'linear-gradient(135deg, #7B9EF8, #2B4AB7)'
          : 'var(--mist)',
        border: isAgent ? 'none' : '1.5px solid var(--horizon)',
        color: isAgent ? 'white' : 'var(--deep)',
        boxShadow: isAgent ? '0 3px 10px rgba(43,74,183,0.25)' : 'none',
      }}>
        {isAgent ? '☁' : 'You'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '76%',
        padding: '13px 17px',
        borderRadius: 'var(--radius)',
        fontSize: 15,
        lineHeight: 1.68,
        boxShadow: 'var(--shadow)',
        background: isAgent ? 'white' : 'linear-gradient(135deg, #2B4AB7 0%, #3D5FCC 100%)',
        border: isAgent ? '1px solid rgba(197,213,255,0.45)' : 'none',
        borderTopLeftRadius: isAgent ? 4 : 'var(--radius)',
        borderTopRightRadius: isAgent ? 'var(--radius)' : 4,
        color: isAgent ? 'var(--ink)' : 'white',
        opacity: message.isError ? 0.7 : 1,
      }}>
        <div dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />

        {/* Tools used badges */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 10,
          }}>
            {message.toolsUsed.map((tool) => (
              <span
                key={tool}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'var(--mist)',
                  border: '1px solid var(--horizon)',
                  borderRadius: 12,
                  padding: '3px 10px',
                  fontSize: 11,
                  color: 'var(--deep)',
                  fontWeight: 500,
                }}
              >
                ⚙ {tool.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
