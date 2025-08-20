# n8n Chatbot (React + Vite + TypeScript)

A modern, responsive chatbot UI that integrates with n8n Chat Agent via webhook.

## Features

- **Dark Theme**: Default dark theme with light mode toggle
- **Real-time Chat**: Connect to your n8n AI agent
- **Audio Messages**: Record and send voice messages (🎤 button)
- **File Attachments**: Attach files with the 📎 button
- **Markdown Support**: Rich text rendering for bot responses
- **Session Management**: Persistent chat history with localStorage
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Quick Start

1. **Environment Setup** (optional - app uses your webhook by default):
   Create `.env` in the project root:
   ```
   VITE_N8N_WEBHOOK_URL=https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat
   VITE_N8N_API_KEY=
   ```

2. **Install & Run**:
   ```bash
   npm i
   npm run dev
   ```

3. **Open**: http://localhost:5173

## Audio Recording

- Click 🎤 to start recording
- Click ⏹️ to stop recording
- Audio messages are sent as `[Audio message recorded]` placeholder
- Microphone access required (browser will prompt for permission)

## File Attachments

- Click 📎 to select files
- Currently shows placeholder functionality
- Can be extended to send files to n8n workflows

## n8n Integration

- **Webhook URL**: https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat
- **Request Format**: JSON with message, sessionId, and metadata
- **Response**: Expects JSON with `message` property
- **Streaming**: Supports both JSON and Server-Sent Events (SSE)

## CORS Configuration

Ensure your n8n instance allows:
- Origin: `http://localhost:5173`
- Headers: `Content-Type`, `Authorization`
- Method: `POST`

## Build & Deploy

```bash
npm run build
npm run preview
```

## Security Notes

- Input sanitization and length limits
- HTTPS required for production
- Optional API key authentication
- Client-side rate limiting (750ms between messages)
