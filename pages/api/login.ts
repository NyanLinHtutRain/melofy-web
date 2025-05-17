// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const playlistId = req.query.id?.toString(); // ✅ Expect playlistId passed as `id`

  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlist ID" });
  }

  const scope = "playlist-modify-public playlist-modify-private";

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state: playlistId, // ✅ Send playlistId as state
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
}
