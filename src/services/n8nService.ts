import dayjs from 'dayjs'
import type { N8nTextResponse, SendMessageOptions, SendMessageRequest } from '../types/chat.types'

const WEBHOOK_URL = (import.meta.env.VITE_N8N_WEBHOOK_URL as string) || 'https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat'
const API_KEY = import.meta.env.VITE_N8N_API_KEY as string | undefined

function sanitize(input: string): string {
	// Basic sanitization - trim and limit length
	const trimmed = input.trim()
	return trimmed.length > 8000 ? trimmed.slice(0, 8000) : trimmed
}

export async function sendMessageToN8n(message: string, sessionId: string, options?: SendMessageOptions): Promise<N8nTextResponse> {
	if (!WEBHOOK_URL) throw new Error('Missing VITE_N8N_WEBHOOK_URL')
	const body: SendMessageRequest = {
		message: sanitize(message),
		sessionId,
		metadata: {
			timestamp: dayjs().toISOString(),
		},
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}
	if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`

	const controller = options?.abortController ?? new AbortController()

	// Retry with exponential backoff: 3 attempts
	let attempt = 0
	let lastError: unknown
	while (attempt < 3) {
		try {
			const res = await fetch(WEBHOOK_URL, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
				signal: controller.signal,
				mode: 'cors', // Explicitly request CORS
			})
			if (!res.ok) {
				throw new Error(`n8n responded with ${res.status}: ${res.statusText}`)
			}
			// Try streaming first, fallback to JSON
			const contentType = res.headers.get('content-type') || ''
			if (contentType.includes('text/event-stream') && options?.onToken && res.body) {
				const reader = res.body.getReader()
				const decoder = new TextDecoder('utf-8')
				let full = ''
				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					const chunk = decoder.decode(value, { stream: true })
					full += chunk
					options.onToken(chunk)
				}
				return { message: full }
			}
			const data = (await res.json()) as N8nTextResponse
			return data
		} catch (err) {
			lastError = err
			attempt += 1
			if (attempt >= 3) break
			await new Promise(r => setTimeout(r, Math.min(1500 * attempt ** 2, 4000)))
		}
	}
	
	// Enhanced error logging for debugging
	if (lastError instanceof Error) {
		console.error('n8n webhook error:', lastError.message)
		if (lastError.message.includes('Failed to fetch') || lastError.message.includes('CORS')) {
			throw new Error('CORS error: Your n8n instance needs to allow requests from https://milkai.netlify.app')
		}
	}
	throw lastError instanceof Error ? lastError : new Error('Failed to call n8n webhook')
}


