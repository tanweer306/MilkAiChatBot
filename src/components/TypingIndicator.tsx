import React from 'react'

export const TypingIndicator: React.FC = () => {
	return (
		<div className="typing" aria-live="polite" aria-label="Assistant is typing">
			<span className="dot" />
			<span className="dot" />
			<span className="dot" />
		</div>
	)
}


