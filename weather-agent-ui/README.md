# Weather Agent UI

React + Vite frontend for the Weather Agent API.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:3000`. The Vite dev server proxies `/api` calls to `http://localhost:8000` automatically — no CORS issues.

Make sure your FastAPI backend is running:
```bash
# in your weather_agent directory
python main.py
```

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Environment

Create a `.env` file if you need to point at a different API:

```env
VITE_API_BASE=http://localhost:8000
```

By default it hits `localhost:8000`.

## Project structure

```
src/
├── components/
│   ├── CloudBackground.jsx   ← animated drifting clouds
│   ├── Message.jsx           ← chat bubble (user + agent)
│   ├── TypingIndicator.jsx   ← animated dots while agent thinks
│   ├── SuggestionChips.jsx   ← quick-start question chips
│   ├── ChatInput.jsx         ← textarea + send button
│   └── ErrorBanner.jsx       ← dismissible error toast
├── hooks/
│   └── useChat.js            ← API calls + message state
├── App.jsx                   ← layout + orchestration
├── main.jsx                  ← React entry point
└── index.css                 ← design tokens + keyframes
```
