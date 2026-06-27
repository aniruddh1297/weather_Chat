import React, { useEffect, useRef, useState } from 'react'
import CloudBackground from './components/CloudBackground'
import Message from './components/Message'
import TypingIndicator from './components/TypingIndicator'
import SuggestionChips from './components/SuggestionChips'
import ChatInput from './components/ChatInput'
import ErrorBanner from './components/ErrorBanner'
import { useChat } from './hooks/useChat'

export default function App() {
  const { messages, isLoading, error, sendMessage, setError } = useChat()
  const [showChips, setShowChips] = useState(true)
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = (question) => {
    if (showChips) setShowChips(false)
    sendMessage(question)
  }

  return (
    <>
      <CloudBackground />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px 80px',
        maxWidth: 760,
        margin: '0 auto',
      }}>

        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: 36,
          animation: 'fadeDown 0.65s ease both',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--mist)',
            border: '1px solid var(--horizon)',
            borderRadius: 20,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--deep)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'var(--breeze)',
              animation: 'pulse 2s ease infinite',
            }} />
            AI Weather Agent
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(34px, 6vw, 52px)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Ask the{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--deep)' }}>sky</em>
            <br />
            anything.
          </h1>

          <p style={{
            marginTop: 10,
            fontSize: 16,
            color: 'var(--dusk)',
            fontWeight: 300,
          }}>
            Powered by DeepSeek · Real-time weather · Multi-day forecasts
          </p>
        </header>

        {/* Suggestion chips — hide after first message */}
        {showChips && (
          <SuggestionChips onSelect={handleSend} />
        )}

        {/* Chat messages */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 20,
          minHeight: showChips ? 0 : 120,
        }}>
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        {/* Error banner */}
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
        />

        {/* Input */}
        <div style={{ width: '100%' }}>
          <ChatInput onSend={handleSend} disabled={isLoading} />

          <p style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--fog)',
            textAlign: 'center',
          }}>
            Press{' '}
            <kbd style={{
              background: 'var(--mist)',
              border: '1px solid var(--horizon)',
              borderRadius: 5,
              padding: '1px 6px',
              fontFamily: 'inherit',
              fontSize: 11,
              color: 'var(--dusk)',
            }}>Enter</kbd>
            {' '}to send ·{' '}
            <kbd style={{
              background: 'var(--mist)',
              border: '1px solid var(--horizon)',
              borderRadius: 5,
              padding: '1px 6px',
              fontFamily: 'inherit',
              fontSize: 11,
              color: 'var(--dusk)',
            }}>Shift+Enter</kbd>
            {' '}for new line
          </p>
        </div>
      </div>
    </>
  )
}
