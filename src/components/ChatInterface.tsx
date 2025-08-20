import React, { useEffect, useMemo, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { InputArea } from './InputArea'
import { TypingIndicator } from './TypingIndicator'

export const ChatInterface: React.FC = () => {
	const { messages, isTyping, send, reset, theme, setTheme } = useChat()
	const endRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, isTyping])

	const hasMessages = useMemo(() => messages.length > 0, [messages])

	return (
		<div className="chat-container" role="application" aria-label="Chatbot">
			<header className="chat-header">
				<div className="chat-title">MilkAI.ai</div>
				<div className="chat-controls">
					<button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
						{theme === 'dark' ? '🌙' : '🌤️'}
					</button>
					<button className="icon-btn" onClick={reset} aria-label="Clear conversation">Clear</button>
				</div>
			</header>
			<div className="messages" aria-live="polite">
				{hasMessages ? (
					messages.map(m => <MessageBubble key={m.id} message={m} />)
				) : (
					<div className="bubble bot" style={{ margin: '16px auto', display: 'inline-block' }}>
						Ask me anything to get started.
					</div>
				)}
				{isTyping && (
					<div className="message-row bot">
						<div className="avatar bot-avatar" aria-hidden><i className="fa-solid fa-cow"></i></div>
						<div className="bubble bot"><TypingIndicator /></div>
					</div>
				)}
				<div ref={endRef} />
			</div>
			<InputArea onSend={send} disabled={isTyping} />
		</div>
	)
}
