export type Role = 'user' | 'bot' | 'system'

export interface ChatMessage {
	id: string
	role: Role
	text: string
	isError?: boolean
	createdAt: string
	formatMarkdown?: boolean
}

export interface ChatMetadata {
	timestamp: string
	userId?: string
}

export interface SendMessageRequest {
	message: string
	sessionId: string
	metadata: ChatMetadata
}

export interface N8nTextResponse {
	message: string
	metadata?: Record<string, unknown>
}

export interface SendMessageOptions {
	files?: File[]
	onToken?: (token: string) => void
	abortController?: AbortController
}


