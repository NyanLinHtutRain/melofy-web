# 🎵 Melofy – AI-Powered Spotify Playlist Generator

**Melofy** is an AI-powered web app that transforms your mood into a real Spotify playlist.  
Just describe how you feel — e.g., `"Rainy and stoner vibes"`, choose a duration — and Melofy generates a curated playlist with real Spotify tracks, perfectly matched to your vibe and synced to your Spotify account.

👉 **Live at:** [https://www.melofyapp.com](https://www.melofyapp.com)

---

## ✨ Current Features

- 🧠 **AI-generated playlist** using OpenAI GPT-3.5-Turbo
- 🎧 **Accurate track matching** via Spotify Search API + smart fallback logic
- ⏱️ **Duration-controlled playlists** (loops until playlist matches or exceeds requested length)
- 🚫 **No duplicate artists** (max 2 songs per artist)
- 🔁 **One playlist per prompt** — same prompt won’t create duplicate playlists
- 🔐 **Spotify OAuth login** — export playlist to your own Spotify account
- 🌐 **Public playlist export** — shared account option for non-auth users
- 💾 **Playlist metadata saved** to AWS DynamoDB (prompt, songs, duration, taste, Spotify URL)
- 📬 **Contact form** with AWS SES email integration
- ✅ **Full-stack, serverless architecture**, production deployed

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** + React
- **Tailwind CSS** (custom UI)
- **NextAuth.js** (Google OAuth login)
- **Spotify Web API** (OAuth + playlist creation)
- Custom branding (Melofy logos, About, ToS, Privacy, Contact pages)

### Backend

- **AWS Lambda** (Node.js) — serverless compute
- **API Gateway** — REST endpoints
- **DynamoDB** — playlist storage + caching
- **OpenAI API** — GPT-based playlist generation
- **AWS SES** — email sending for Contact form

### DevOps

- **Vercel** — Frontend + Serverless backend
- **AWS Route 53** — DNS + custom domain
- **GitHub** — Version control

---

## 🔧 Key API Routes (Current)

| Route                  | Method | Description                           |
|------------------------|--------|---------------------------------------|
| `/api/login`           | GET    | Redirects to Spotify OAuth login      |
| `/api/callback`        | GET    | Handles Spotify callback + playlist sync |
| `/generate-playlist`   | POST   | Calls OpenAI to generate song list    |
| `/prepare-playlist`    | POST   | Saves draft playlist in DynamoDB      |
| `/get-playlist?id=...` | GET    | Fetches playlist metadata from DynamoDB |
| `/save-playlist`       | POST   | Saves final playlist metadata in DynamoDB |
| `/api/contact`         | POST   | Sends Contact form email via AWS SES  |

---

## 🧪 How It Works

1. User enters:
   - A **prompt** (e.g., `"study music while it's raining"`)
   - **Duration** in minutes
   - Optional **Taste** preference (Trending, Chill, Underrated)

2. Melofy sends this data to OpenAI and generates a playlist:
   - Max 2 songs per artist
   - Duration ≈ requested minutes
   - Vibe and mood focused

3. Draft playlist saved to DynamoDB.

4. User chooses:
   - **View Public Playlist** — sync to shared Spotify account
   - **Export to My Spotify** — requires Spotify login (OAuth)

5. If logged in:
   - Melofy matches tracks via Spotify Search API
   - Fallbacks used to ensure no missing tracks
   - Creates real Spotify playlist
   - Final playlist saved to DynamoDB with Spotify URL
   - User redirected to Spotify playlist page

6. User can submit feedback via **Contact page** (email via AWS SES).

---

## 🎨 UI / UX Features

- Fully responsive UI with light/dark theme
- Polished playlist display:
  - Numbered list
  - Clean spacing
  - White text in dark mode
- Sticky header with login state awareness
- Updated favicon + logo branding
- Custom About, Terms of Service, Privacy Policy, Contact pages
- Google OAuth login integrated in Header + Profile page
- Public vs Private playlist UX clearly explained to user

---

## 📦 Deployment

- **Frontend:** Vercel
- **Backend:** AWS Lambda via API Gateway
- **Storage:** DynamoDB
- **Email:** AWS SES
- **Domain:** [https://www.melofyapp.com](https://www.melofyapp.com) (managed via Route 53)

---

## 🚀 Roadmap (Post-MVP Phase 2 & 3)

### Short-Term (Phase 2)

- 🗂️ Implement AWS Cognito **user login system** (real user database)
- 🕹️ **User playlist dashboard** — see history of generated playlists
- 🎛️ **Re-generate playlist** option — allow users to tweak/retry prompts
- 🎭 Add **public playlist gallery** — optionally share best playlists
- 🌍 Improve **fallback search for non-English songs** (Japanese, Burmese, etc.)
- 🎼 Smarter **duration calibration** — even closer match to requested length

### Long-Term (Phase 3)

- 🎨 Polish **mobile UX** (Framer Motion animations, improved responsiveness)
- 🛡️ Harden OAuth flow and ensure idempotency (fix duplicate playlist creation bug)
- 🌎 SEO optimization (meta tags, sitemap, Google Search Console)
- 📊 Add user analytics / engagement tracking
- ⚙️ Add admin dashboard for playlist moderation (future SaaS idea)

---

## 👨‍💻 Author

Created by [Nyan Lin Htut](https://www.melofyapp.com)

- 💼 Full stack AI/Software Developer
- ✉️ Contact: nyanlinhtut662003@gmail.com
- 🌐 GitHub: [@NyanLinHtutRain](https://github.com/NyanLinHtutRain)

---

## 📄 License

MIT License © 2025

---

