import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types/chat.types'

interface Props {
	message: ChatMessage
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
	const content = message.formatMarkdown ? (
		<ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
	) : (
		<span>{message.text}</span>
	)
	const roleClass = message.isError ? 'error' : message.role === 'user' ? 'user' : 'bot'
	
	// Render avatar based on role
	const renderAvatar = () => {
		if (message.role === 'user') {
			return <div className="avatar user-avatar" aria-hidden><i className="fa-solid fa-comment-dots"></i></div>
		} else if (message.role === 'bot') {
			return <div className="avatar bot-avatar" aria-hidden><i className="fa-solid fa-cow"></i></div>
		} else {
			return <div className="avatar" aria-hidden>!</div>
		}
	}
	
	return (
		<div className={`message-row ${message.role === 'user' ? 'user' : 'bot'}`}>
			{renderAvatar()}
			<div className={`bubble ${roleClass}`}>
				{content}
				<div className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</div>
			</div>
		</div>
	)
}
