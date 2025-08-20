import React, { useCallback, useRef, useState } from 'react'

interface Props {
	onSend: (text: string) => void
	disabled?: boolean
}

export const InputArea: React.FC<Props> = ({ onSend, disabled }) => {
	const [text, setText] = useState('')
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [isRecording, setIsRecording] = useState(false)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const audioChunksRef = useRef<Blob[]>([])

	const submit = useCallback(() => {
		if (!text.trim()) return
		onSend(text)
		setText('')
	}, [onSend, text])

	const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			submit()
		}
	}, [submit])

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const mediaRecorder = new MediaRecorder(stream)
			mediaRecorderRef.current = mediaRecorder
			audioChunksRef.current = []

			mediaRecorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data)
			}

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
				// For now, just send a placeholder message - you can implement audio processing later
				onSend('[Audio message recorded]')
				stream.getTracks().forEach(track => track.stop())
			}

			mediaRecorder.start()
			setIsRecording(true)
		} catch (err) {
			console.error('Error accessing microphone:', err)
		}
	}, [onSend])

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop()
			setIsRecording(false)
		}
	}, [isRecording])

	return (
		<div className="input-area">
			<button 
				className="file-btn icon-btn" 
				onClick={() => fileInputRef.current?.click()} 
				aria-label="Attach a file" 
				disabled={disabled}
			>
				📎
			</button>
			<input 
				ref={fileInputRef} 
				className="sr-only" 
				type="file" 
				multiple 
				onChange={() => { /* Hook up later to send with payload if needed */ }} 
			/>
			<textarea
				className="textarea"
				placeholder="Type a message..."
				value={text}
				onChange={e => setText(e.target.value)}
				onKeyDown={onKeyDown}
				aria-label="Message input"
				disabled={disabled}
			/>
			<div className="input-buttons">
				<button 
					className={`audio-btn icon-btn ${isRecording ? 'recording' : ''}`}
					onClick={isRecording ? stopRecording : startRecording}
					aria-label={isRecording ? 'Stop recording' : 'Start recording'}
					disabled={disabled}
				>
					{isRecording ? '⏹️' : '🎤'}
				</button>
				<button 
					className="send-btn" 
					onClick={submit} 
					disabled={disabled || !text.trim()} 
					aria-label="Send message"
				>
					Send
				</button>
			</div>
		</div>
	)
}
