// pages/api/playlist/sync.ts
import type { NextApiRequest, NextApiResponse } from "next";

const searchTrack = async (accessToken: string, title: string, artist: string) => {
  const query = `track:${title.trim()} artist:${artist.trim()}`;
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await res.json();
  return data.tracks?.items?.[0]?.uri || null;
};

const addTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  uris: string[]
) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });

  return res.ok;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { playlistId, accessToken, songs } = req.body;

  if (!playlistId || !accessToken || !songs || !Array.isArray(songs)) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const uris: string[] = [];

  for (const song of songs) {
    const uri = await searchTrack(accessToken, song.title, song.artist);
    if (uri) {
      uris.push(uri);
    } else {
      console.warn(`❌ No match for: ${song.title} - ${song.artist}`);
    }
  }

  if (uris.length === 0) {
    return res.status(404).json({ error: "No valid tracks found" });
  }

  const success = await addTracksToPlaylist(accessToken, playlistId, uris);

  if (success) {
    return res.status(200).json({ success: true, added: uris.length });
  } else {
    return res.status(500).json({ error: "Failed to add tracks to playlist" });
  }
}
