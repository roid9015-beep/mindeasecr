# 🌿 MindEase AI

> **Your always-available emotional clarity companion.**  
> Designed for people who can't afford monthly therapy — but deserve real support.

---

## What is MindEase AI?

MindEase AI is a web application that acts as an empathetic AI companion with a psychological and philosophical approach. It's not a replacement for therapy — it's something better for your everyday mind: always available, personalized, and affordable.

The app is designed to **scale globally**: it automatically detects the user's region and adapts the language and voice accordingly (Spanish, English, Portuguese, French, German, Italian and more).

---

## Core Features

### 🤖 AI Chat Companion
- Deep, empathetic conversations with a psychological and philosophical focus
- Remembers the user's history and emotional patterns (Premium)
- Conversation starters to help users begin sharing
- Free tier: 1 full conversation per month
- Premium: unlimited conversations throughout the month

### 🎤 Voice Mode (Premium)
- The AI reads responses aloud using a regionally adapted voice
- Voice pitch and speed are tuned per dialect (e.g. `es-MX`, `es-AR`, `pt-BR`, `en-GB`)
- Detects mood from conversation to keep a warm, connected tone

### 🌍 Auto Region Detection
- Detects user country via IP on first load
- Maps country → locale → voice key automatically
- Covers 30+ countries across Latin America, Europe, and North America
- Users can manually override language in Settings

### 🧘 Breathing Exercise
- Box breathing (4-4-6-2 pattern)
- Animated visual guide
- Available in all languages

### 🎯 5-4-3-2-1 Grounding
- Step-by-step guided sensory grounding technique
- Effective for anxiety and panic
- Fully localized

### 📊 Emotional Insights Dashboard
- 7-day mood trend chart
- Emotional pattern analysis (anxiety, stress, calm)
- Personalized observations from MindEase
- Weekly progress overview

### 😌 Daily Mood Check-In
- 5-point mood scale from Overwhelmed to Good
- Tracks days active, conversations, mood score, and relief sessions

### ⚙️ Settings
- Voice on/off toggle
- Push notifications & daily reminders
- Language & region selector
- Subscription management
- Privacy policy, Terms of Service, Medical disclaimer

---

## Freemium Model

| Feature | Free | Premium ($5/mo) |
|---|---|---|
| AI conversations | 1 per month | Unlimited |
| Breathing & grounding | ✅ | ✅ |
| Daily mood check-in | ✅ | ✅ |
| Voice responses | ❌ | ✅ |
| Emotional memory | ❌ | ✅ |
| Mood analytics | Basic | Advanced |
| Personalized plans | ❌ | ✅ |
| Priority support | ❌ | ✅ |

Payments via **PayPal**. Cancel anytime.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Auth | Firebase Authentication |
| State | Zustand (`useAppStore`) |
| Styling | CSS Variables + inline styles |
| i18n | Custom translation system (`lib/i18n.js`) |
| Voice | Web Speech API (`SpeechSynthesis`) |
| Region detection | `ipapi.co` + navigator.language fallback |
| AI | OpenAI API (via `/api/chat` route) |
| Payments | PayPal Subscriptions |

---

## Project Structure

```
mindease/
├── app/
│   └── page.js                    # Entry point → <MindEaseApp />
├── components/
│   ├── MindEaseApp.jsx            # Root component (auth, routing, layout)
│   ├── layout/
│   │   ├── Sidebar.jsx            # Desktop navigation
│   │   └── BottomNav.jsx          # Mobile navigation
│   ├── ui/
│   │   ├── BackgroundOrbs.jsx     # Ambient background animation
│   │   ├── PremiumModal.jsx       # Upgrade flow
│   │   ├── LanguageBadge.jsx      # Region selector badge
│   │   └── TermsModal.jsx         # Terms of service modal
│   └── features/
│       ├── LandingPage.jsx        # Public landing page
│       ├── AuthPage.jsx           # Login / Register (Firebase)
│       ├── Dashboard.jsx          # Home dashboard with mood check-in
│       ├── AIChat.jsx             # AI conversation (core feature)
│       ├── BreathingExercise.jsx  # Box breathing tool
│       ├── GroundingExercise.jsx  # 5-4-3-2-1 grounding tool
│       ├── Insights.jsx           # Mood analytics & trends
│       └── Settings.jsx           # User preferences & account
├── lib/
│   ├── firebase.js                # Firebase app initialization + Auth
│   ├── i18n.js                    # getTranslation(locale) → translations
│   └── utils.js                   # detectRegion, getGreeting, session helpers
├── store/
│   └── useAppStore.js             # Zustand global state
└── constants.js                   # TRANSLATIONS (en/es/pt), REGIONAL_VOICES, maps
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-user/mindease.git
cd mindease
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI
OPENAI_API_KEY=your_openai_key

# PayPal (for Premium subscriptions)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

---

## Supported Languages & Regions

| Language | Locales | Example Countries |
|---|---|---|
| Español | es-MX, es-ES, es-AR, es-CO, es-CR, es-US | México, España, Argentina, Colombia, Costa Rica, +15 more |
| English | en-US, en-GB | USA, UK, Canada, Australia |
| Português | pt-BR, pt-PT | Brasil, Portugal |
| Français | fr-FR | France |
| Deutsch | de-DE | Germany |
| Italiano | it-IT | Italy |

---

## AI Approach

MindEase AI is designed to:

- **Always respond with empathy first** — validate before advising
- **Apply a psychological and philosophical lens** to every conversation
- **Never diagnose** — always encourage professional help for clinical needs
- **Maintain emotional memory** (Premium) — reference past sessions to show the user they are truly known
- **Adapt tone to mood** — especially in Voice Mode, reading emotional cues from the conversation

The system prompt instructs the AI to act as a warm, grounded companion — drawing from CBT, Stoicism, mindfulness, and humanistic psychology — while making it clear it is not a licensed therapist.

---

## Legal & Safety

MindEase AI includes prominent disclaimers:

- It is **not** a medical service, therapist, or crisis line
- For emergencies: call **988** (US), **CVV 188** (Brasil), or your local crisis line
- User data is private and never sold
- Conversations are processed only to generate AI responses

---

## Deployment

MindEase is optimized for deployment on **Vercel**:

```bash
vercel --prod
```

For App Store / Play Store distribution, wrap with **Capacitor** or **React Native Web**.

---

## Roadmap

- [ ] Persistent conversation memory in Firestore
- [ ] Real-time mood analysis from voice tone
- [ ] Personalized daily plan generation
- [ ] Sleep relaxation prompts
- [ ] Crisis detection + escalation flow
- [ ] iOS & Android native apps

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

MIT © MindEase AI
