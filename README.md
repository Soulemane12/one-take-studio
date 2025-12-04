# One-Take Studio

AI content engine that turns a single audio/video rant into a full weekly content calendar. Deepgram handles the transcription, Groq crafts platform-specific posts, and the React UI showcases everything in a polished dashboard.

## Features

- 🎙️ **Deepgram transcription** with optional pause-based chunking for cleaner sentence boundaries.
- 🔥 **Groq-powered analysis** that extracts spicy moments, topics, and catchy titles.
- 📱 **Auto-generated content** for TikTok, Twitter, LinkedIn, and a newsletter—each using platform-native templates.
- 🛡️ **Resilient JSON parsing** that repairs malformed model output before surfacing it to the UI.
- 🗓️ **Content calendar UI** with expandable cards, copy-to-clipboard actions, and real-time stats.

## Prerequisites

- **Node.js 18+** and **npm 9+**
- Deepgram and Groq API keys

## Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Fill in the values:
   - `DEEPGRAM_API_KEY` – from [Deepgram Console](https://console.deepgram.com/)
   - `GROQ_API_KEY` – from [Groq Console](https://console.groq.com/)
   - `PORT` – optional, defaults to `3001`

The `.env` file is already git-ignored.

## Install Dependencies

```bash
npm install
```

## Run the App Locally

```bash
npm run dev
```

This starts the Express API (Deepgram + Groq) and the Vite client simultaneously. The server runs on `http://localhost:3001`, the UI on `http://localhost:5173` (or the next free Vite port). Upload an audio/video file from the dashboard to watch the calendar fill with real AI-generated content.

### Useful Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Run API + client together (via `concurrently`). |
| `npm run server` | Start only the Express API (`tsx server/index.ts`). |
| `npm run dev:client` | Start only the Vite client. |
| `npm run build` | Production build of the React app. |
| `npm run preview` | Preview the production build locally. |

## API Overview

- `POST /api/transcribe` – accepts multipart form data with an `audio` file. Internally:
  1. Upload stored to `uploads/`
  2. Deepgram generates structured transcript chunks
  3. Groq analyzes the transcript and generates TikTok/Twitter/LinkedIn/newsletter content in parallel
  4. Temporary upload is deleted before responding
- `POST /api/transcribe-url` – same as above but fetches the media file from a URL instead of multipart upload.

Both routes return:

```json
{
  "success": true,
  "data": {
    "transcript": { "...": "..." },
    "analysis": { "title": "", "topics": [], "spicyMoments": [] },
    "generatedContent": {
      "tiktok": [],
      "twitter": [],
      "linkedin": [],
      "newsletter": []
    }
  }
}
```

## Frontend Flow

1. `AudioAnalyzer` handles uploads, shows progress toasts, and switches the UI to the content calendar when the API responds.
2. `ContentCalendar` merges the real generated content with the styled mock layout for consistency.
3. `ContentCard` lets creators expand a script, copy it, and review timing/tags.

Everything is powered by Tailwind, shadcn/ui, and Lucide icons.

## Troubleshooting

- **Browserslist warning during build** – run `npx update-browserslist-db@latest`.
- **Transcription errors** – confirm the media format is supported and the Deepgram key has sufficient quota.
- **Groq/JSON parsing errors** – check the server logs; malformed JSON will be reported along with the first ~500 characters of the model response.
- **Uploads folder** – temporary files are deleted after each request, but the folder itself lives at `uploads/` (git-ignored).

Now record a rant, upload it, and let One-Take Studio produce a week of platform-ready content in seconds.
