import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { sendMessageToN8n } from '../services/n8nService'
import { getOrCreateSessionId, loadHistory, saveHistory, resetSession } from '../services/sessionManager'
import type { ChatMessage } from '../types/chat.types'

export function useChat() {
	const [sessionId, setSessionId] = useState<string>('')
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [theme, setTheme] = useState<'dark' | 'light'>('dark')
	const abortRef = useRef<AbortController | null>(null)
	const draftBotIdRef = useRef<string | null>(null)
	const lastSendAtRef = useRef<number>(0)

	useEffect(() => {
		const id = getOrCreateSessionId()
		setSessionId(id)
		setMessages(loadHistory(id))
	}, [])

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	useEffect(() => {
		if (!sessionId) return
		saveHistory(sessionId, messages)
	}, [messages, sessionId])

	const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const now = Date.now();
    if (now - lastSendAtRef.current < 750) return;
    lastSendAtRef.current = now;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        text,
        createdAt: dayjs().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    try {
        let accumulated = '';
        const res = await sendMessageToN8n(text, sessionId, {
            abortController: abortRef.current!,
            onToken: (tok) => {
                accumulated += tok;
                setMessages(prev => {
                    if (!draftBotIdRef.current) {
                        const draftId = uuidv4();
                        draftBotIdRef.current = draftId;
                        return [...prev, { id: draftId, role: 'bot', text: accumulated, createdAt: dayjs().toISOString(), formatMarkdown: true }]
                    }
                    return prev.map(m => (m.id === draftBotIdRef.current ? { ...m, text: accumulated } : m))
                })
            },
        })
        if (!accumulated) {
            const botMsg: ChatMessage = {
                id: uuidv4(),
                role: 'bot',
                text: res.message ?? '',
                createdAt: dayjs().toISOString(),
                formatMarkdown: true,
            }
            setMessages(prev => [...prev, botMsg])
        }
    } catch (err) {
        const errorMsg: ChatMessage = {
            id: uuidv4(),
            role: 'system',
            text: err instanceof Error ? err.message : 'Something went wrong',
            createdAt: dayjs().toISOString(),
            isError: true,
        }
        setMessages(prev => [...prev, errorMsg])
    } finally {
        setIsTyping(false)
        draftBotIdRef.current = null
    }
	}, [sessionId])

	const reset = useCallback(() => {
		resetSession()
		const id = getOrCreateSessionId()
		setMessages([])
		setSessionId(id)
	}, [])

	const value = useMemo(() => ({ messages, isTyping, send, reset, theme, setTheme }), [messages, isTyping, send, reset, theme])

	return value
}


