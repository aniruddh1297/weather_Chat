import React from 'react'

const CHIPS = [
  { emoji: '🌤', text: 'Weather in Berlin right now' },
  { emoji: '🌧', text: 'Will it rain in Tokyo this week?' },
  { emoji: '☀️', text: 'Compare London & Paris forecast' },
  { emoji: '🌪', text: 'Wind speed in Chicago today' },
  { emoji: '🌡', text: 'Should I pack for Barcelona tomorrow?' },
  { emoji: '❄️', text: '5-day forecast for Oslo' },
]

export default function SuggestionChips({ onSelect }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 24,
      animation: 'fadeUp 0.6s 0.25s ease both',
      animationFillMode: 'both',
    }}>
      {CHIPS.map(({ emoji, text }) => (
        <Chip key={text} emoji={emoji} text={text} onSelect={onSelect} />
      ))}
    </div>
  )
}

function Chip({ emoji, text, onSelect }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      onClick={() => onSelect(text)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--mist)' : 'white',
        border: `1.5px solid ${hovered ? 'var(--breeze)' : 'var(--horizon)'}`,
        borderRadius: 20,
        padding: '7px 15px',
        fontSize: 13,
        color: hovered ? 'var(--deep)' : 'var(--dusk)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 4px 14px rgba(123,158,248,0.22)' : 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}
    >
      {emoji} {text}
    </button>
  )
}
