import type { NextApiRequest, NextApiResponse } from "next";

// Function to refresh access_token using refresh_token
async function getAccessTokenFromRefreshToken() {
  const basicAuth = Buffer.from(
    `${process.env.PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.PUBLIC_SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.PUBLIC_SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Failed to refresh Spotify token:", data);
    throw new Error("Failed to refresh Spotify token");
  }

  console.log("Refreshed Spotify access_token");

  return data.access_token as string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const tempId = req.query.id as string;
  if (!tempId) {
    return res.status(400).json({ error: "Missing playlist ID" });
  }

  try {
    // 1️⃣ Fetch prepared playlist from DynamoDB
    const playlistRes = await fetch(
      `https://nlwpifw1n2.execute-api.us-east-1.amazonaws.com/prod/get-playlist?id=${tempId}`
    );

    const playlistData = await playlistRes.json();

    if (!playlistRes.ok || !playlistData.songs) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const songs = playlistData.songs;
    const prompt = playlistData.prompt || "Melofy Playlist";
    const taste = playlistData.taste || "";
    const duration = playlistData.duration || "";

    // 2️⃣ Get fresh access_token using refresh_token
    const accessToken = await getAccessTokenFromRefreshToken();
    const sharedUserId = process.env.PUBLIC_SPOTIFY_USER_ID;

    if (!accessToken || !sharedUserId) {
      return res.status(500).json({ error: "Missing shared Spotify credentials" });
    }

    // 3️⃣ Create playlist in shared Spotify account
    const createPlaylistRes = await fetch(
      `https://api.spotify.com/v1/users/${sharedUserId}/playlists`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `🎵 ${prompt}`,
          description: `Taste: ${taste} | Duration: ${duration} min | Created by Melofy`,
          public: true,
        }),
      }
    );

    console.log("Spotify createPlaylistRes status:", createPlaylistRes.status);
    console.log("Spotify createPlaylistRes body:", await createPlaylistRes.clone().text());

    const playlistCreated = await createPlaylistRes.json();

    if (!createPlaylistRes.ok || !playlistCreated.id) {
      return res.status(500).json({ error: "Failed to create Spotify playlist" });
    }

    const playlistId = playlistCreated.id;
    const publicSpotifyUrl = playlistCreated.external_urls?.spotify;

    // 4️⃣ Search & add tracks to playlist
    const uris: string[] = [];

    for (const song of songs) {
      const query = `track:${song.title} artist:${song.artist}`;
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchRes.json();
      const track = searchData.tracks?.items?.[0];

      if (track && track.uri) {
        uris.push(track.uri);
      }
    }

    if (uris.length > 0) {
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris,
        }),
      });
    }

    // 5️⃣ Update DynamoDB with publicSpotifyUrl
    await fetch(`https://nlwpifw1n2.execute-api.us-east-1.amazonaws.com/prod/save-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "shared-public",
        playlistId: tempId,
        prompt,
        songs,
        duration,
        taste,
        spotifyUrl: publicSpotifyUrl, // final clean save
      }),
    });

    // 6️⃣ Return publicSpotifyUrl to frontend
    return res.status(200).json({ publicSpotifyUrl });
  } catch (err: any) {
    console.error("Public sync error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
