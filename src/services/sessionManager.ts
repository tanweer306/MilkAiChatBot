import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '../types/chat.types'

const SESSION_KEY = 'chat_session_id'

export function getOrCreateSessionId(): string {
	const existingSessionId = localStorage.getItem(SESSION_KEY)
	if (!existingSessionId) {
		const newSessionId = uuidv4()
		localStorage.setItem(SESSION_KEY, newSessionId)
		return newSessionId
	}
	return existingSessionId
}

export function resetSession(): void {
	const id = localStorage.getItem(SESSION_KEY)
	if (id) {
		localStorage.removeItem(historyKey(id))
	}
	localStorage.removeItem(SESSION_KEY)
}

function historyKey(sessionId: string): string {
	return `chat_history_${sessionId}`
}

export function loadHistory(sessionId: string): ChatMessage[] {
	try {
		const raw = localStorage.getItem(historyKey(sessionId))
		if (!raw) return []
		const parsed: ChatMessage[] = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

export function saveHistory(sessionId: string, messages: ChatMessage[]): void {
	try {
		localStorage.setItem(historyKey(sessionId), JSON.stringify(messages))
	} catch {
		// ignore quota errors
	}
}


