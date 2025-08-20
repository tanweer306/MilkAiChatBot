# Netlify Deployment - CORS Configuration

## 🚨 **Issue: CORS Error on Netlify**

Your MilkAI.ai chatbot is deployed at [https://milkai.netlify.app/](https://milkai.netlify.app/) but can't communicate with n8n due to CORS restrictions.

**Local works**: ✅ `http://localhost:5173` → n8n webhook  
**Netlify fails**: ❌ `https://milkai.netlify.app/` → n8n webhook

## 🔧 **Solution: Configure n8n CORS**

### **Option 1: n8n Instance Level CORS (Recommended)**

1. **Access your n8n instance**: Go to your n8n admin panel
2. **Environment Variables**: Add these CORS settings:

```bash
N8N_CORS_ORIGIN=https://milkai.netlify.app
N8N_CORS_CREDENTIALS=true
N8N_CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
N8N_CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
```

3. **Restart n8n** after adding these variables

### **Option 2: Workflow Level CORS**

Add an **HTTP Response** node in your n8n workflow **before** the webhook trigger:

```json
{
  "headers": {
    "Access-Control-Allow-Origin": "https://milkai.netlify.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  }
}
```

### **Option 3: Proxy Solution (If CORS can't be configured)**

Create a Netlify function to proxy requests:

1. **Create file**: `netlify/functions/proxy-n8n.js`
2. **Add proxy logic** to forward requests to n8n
3. **Update frontend** to call `/api/proxy-n8n` instead of direct n8n URL

## 🌐 **Your Current Setup**

- **Frontend**: https://milkai.netlify.app/
- **n8n Webhook**: https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat
- **Issue**: n8n doesn't allow requests from Netlify domain

## ✅ **Quick Test**

After configuring CORS, test with:

```bash
curl -X POST "https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat" \
  -H "Origin: https://milkai.netlify.app" \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test","metadata":{"timestamp":"2025-08-20T12:00:00.000Z"}}'
```

## 🔍 **Debugging**

1. **Browser Console**: Check for CORS errors
2. **Network Tab**: See if request reaches n8n
3. **n8n Logs**: Check if webhook receives requests
4. **Netlify Function Logs**: If using proxy approach

## 📱 **Alternative: Environment-Specific URLs**

You can also set different webhook URLs for different environments:

```bash
# .env.local (development)
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/test

# .env.production (Netlify)
VITE_N8N_WEBHOOK_URL=https://tanveer306.app.n8n.cloud/webhook/32209a08-c344-4a80-8a56-c408eb902db6/chat
```

## 🚀 **Deploy After Fix**

1. Configure CORS in n8n
2. Test the webhook endpoint
3. Commit and push changes
4. Netlify will auto-deploy
5. Test communication from live site

---

**Most likely solution**: Configure CORS at the n8n instance level to allow `https://milkai.netlify.app`
