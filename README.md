# 🎵 Melofy – AI-Powered Spotify Playlist Generator

Melofy is a smart web app that turns your vibe into a real Spotify playlist. Just describe how you feel (e.g., “Rainy and stoner vibes”), choose a duration, and let Melofy generate a full playlist with real tracks — then instantly sync it to your Spotify account.

Live soon at: [https://nyanlinhtut.com](https://nyanlinhtut.com)

---

## ✨ Features

- 🧠 AI-generated song list using OpenAI
- 🎧 Accurate track matching via Spotify Search API
- ⏱️ Playlist duration matches your mood length (e.g., ~10 mins ≈ 3 songs)
- ✅ One playlist per prompt, even if multiple moods are mentioned
- 🌐 AWS Lambda + DynamoDB + API Gateway for serverless backend
- 🔐 Spotify OAuth login to create real user playlists
- 💾 Saved playlist history (temp + final)
- 📦 Full-stack, production-ready and deployable to Vercel

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15 + React
- Tailwind CSS (UI styling)
- Spotify Web API (OAuth + playlist creation)

### Backend
- AWS Lambda (Node.js)
- API Gateway (REST)
- DynamoDB (playlist storage)
- OpenAI API (chat completions for playlist ideas)

---

## 🔧 Key API Routes

| Route                  | Method | Description                           |
|------------------------|--------|---------------------------------------|
| `/api/login`           | GET    | Redirects to Spotify OAuth login      |
| `/api/callback`        | GET    | Handles Spotify callback, syncs data  |
| `/generate-playlist`   | POST   | Generates songs using OpenAI          |
| `/prepare-playlist`    | POST   | Saves draft playlist to DynamoDB      |
| `/get-playlist?id=...` | GET    | Fetches playlist from DynamoDB by ID  |
| `/save-playlist`       | POST   | Saves final playlist to DynamoDB      |

---
## 🧪 How It Works

1. User enters a *prompt*, e.g., `"study music while it's raining"` and chooses duration.
2. Melofy uses OpenAI to generate a vibe-accurate list of songs.
3. Songs are saved as a **draft** in DynamoDB.
4. User is redirected to Spotify login.
5. After login, Melofy:
   - Fetches the draft.
   - Matches songs using `track:{title} artist:{artist}`.
   - Replaces missing tracks with similar ones if needed.
   - Creates + fills a real Spotify playlist.
6. Final playlist is saved + user is redirected to Spotify.

---

## 🚀 Deployment

Deployed via:
- Vercel (Frontend)
- AWS Lambda (Backend)
- GitHub (Codebase)
- Route 53 + Custom Domain (`nyanlinhtut.com`)

---

## ✅ To-Do (Post-MVP Phase)

- Add Spotify user profile screen
- Add public playlist gallery
- Improve fallback search for non-English songs
- Add user login system via AWS Cognito
- Calibrate duration to match user input more precisely
- Re-generate playlist option
- Dashboard of previously generated playlists

---

## 👨‍💻 Author

Created by [Nyan Lin Htut](https://nyanlinhtut.com)

- 💼 Business Analytics + AI Developer
- ✉️ Contact: nyanlinhtutrain@gmail.com
- 🌐 GitHub: [@NyanLinHtutRain](https://github.com/NyanLinHtutRain)

---

## 📄 License

MIT License © 2025
