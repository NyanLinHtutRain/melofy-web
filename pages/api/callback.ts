import type { NextApiRequest, NextApiResponse } from "next";

// 🔍 Advanced search with fallback logic
const searchTrack = async (accessToken: string, title: string, artist: string) => {
  const cleanTitle = title.replace(/[^\w\s]/gi, "").toLowerCase();

  const queries = [
    `track:${title.trim()} artist:${artist.trim()}`,
    `track:${title.trim()}`,
    `track:${cleanTitle}`,
  ];

  for (const query of queries) {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await res.json();
    const track = data.tracks?.items?.[0];
    if (track?.uri) return track;
  }

  // 🛑 Final fallback: use Spotify recommendations
  const recRes = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=1&seed_artists=4NHQUGzhtTLFvgF5SZesLK`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const recData = await recRes.json();
  return recData.tracks?.[0] || null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const tempId = req.query.state as string;

  if (!code || !tempId) {
    return res.status(400).json({ error: "Missing Spotify code or tempId" });
  }

  try {
    // Step 1: Exchange code for token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("Spotify token exchange failed");

    // Step 2: Fetch draft playlist from DynamoDB
    const getPlaylistRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-playlist?id=${tempId}`
    );
    const draft = await getPlaylistRes.json();
    const { prompt, duration, taste } = draft;
    let songs = draft.songs;

    if (songs?.[0]?.M) {
      songs = songs.map((item: any) => ({
        title: item.M.title.S,
        artist: item.M.artist.S,
      }));
    } else if (typeof songs === "string") {
      songs = JSON.parse(songs);
    }
    if (!Array.isArray(songs)) throw new Error("songs is not a valid array");

    // Step 3: Get Spotify user profile
    const userProfile = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userProfile.json();
    const userId = userData.id;

    // Step 4: Create Spotify playlist
    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Melofy - ${prompt}`,
        description: `Mood: ${taste}`,
        public: false,
      }),
    });

    const playlistData = await playlistRes.json();
    const playlistId = playlistData.id;
    const spotifyUrl = playlistData.external_urls?.spotify;
    if (!playlistId || !spotifyUrl) throw new Error("Failed to create playlist");

    // Step 5: Match tracks and ensure total duration >= user input
    const uris: string[] = [];
    let totalDuration = 0;
    const targetMs = parseInt(duration) * 60000;

    for (const song of songs) {
      const track = await searchTrack(accessToken, song.title, song.artist);
      if (track?.uri && track.duration_ms) {
        uris.push(track.uri);
        totalDuration += track.duration_ms;

        if (totalDuration >= targetMs) break; // ✅ Stop only when duration met
      }
    }

    // Step 6: Add matched tracks to playlist
    if (uris.length > 0) {
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      });
    }

    // Step 7: Save final playlist metadata
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-playlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        playlistId,
        prompt,
        songs,
        duration,
        taste,
        spotifyUrl,
      }),
    });

    // Step 8: Redirect to frontend success page
    res.redirect(`/spotify-success?playlist=${playlistId}`);
  } catch (err: any) {
    console.error("❌ Callback error:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: err.message || "Unknown error occurred" });
  }
}
