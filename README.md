# 🌿 MindEase AI

AI companion for stress relief, emotional clarity, and overthinking support.

**Plans:** Free (1 deep conversation/month) · Premium $5/month (unlimited)

## Quick Start

```bash
cp .env.example .env.local   # fill in your API keys
npm install
npm run dev                   # → http://localhost:3000
```

## Environment Variables (.env.local)

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | console.firebase.google.com |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | developer.paypal.com |

## Vercel Deploy

1. Push repo to GitHub
2. Import at vercel.com/new
3. Add all env vars in Vercel dashboard
4. Deploy ✅

> MindEase AI is an emotional support companion, not a medical service.
