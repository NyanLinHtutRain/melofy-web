// pages/spotify-success.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SpotifySuccess = () => {
  const router = useRouter();
  const { playlist: playlistId } = router.query;

  const [status, setStatus] = useState("Syncing playlist to Spotify...");

  useEffect(() => {
    console.log("🚀 Router ready?", router.isReady);
    console.log("🎧 Playlist ID from query:", playlistId);

    if (!router.isReady || !playlistId) return;

    const syncPlaylist = async () => {
      try {
        console.log("🔁 Starting playlist sync...");

        // Step 1: Fetch playlist from backend
        const fetchRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-playlist?id=${playlistId}`
        );
        const data = await fetchRes.json();
        console.log("✅ Playlist data:", data);

        if (!data || !data.songs) {
          setStatus("⚠️ Failed to load playlist data from backend.");
          return;
        }

        const { songs, prompt, duration, taste } = data;

        // 🧾 Step 2: Save playlist again with Spotify URL
        const saveRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/save-playlist`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "demo-user-001", // Or real userId if available
              playlistId,
              prompt,
              songs,
              duration,
              taste,
              spotifyUrl: `https://open.spotify.com/playlist/${playlistId}`,
            }),
          }
        );

        const saveData = await saveRes.json();
        console.log("🧾 Save response:", saveData);

        if (!saveRes.ok) {
          setStatus(`⚠️ Playlist synced but failed to save: ${saveData.error}`);
          return;
        }

        setStatus("🎉 Playlist saved and synced successfully! Redirecting...");

        // Step 3: Redirect to Spotify
        setTimeout(() => {
          window.location.href = `https://open.spotify.com/playlist/${playlistId}`;
        }, 2000);
      } catch (err) {
        console.error("❌ Unexpected error during sync:", err);
        setStatus("❌ Unexpected error occurred.");
      }
    };

    syncPlaylist();
  }, [playlistId, router.isReady]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl text-center p-6">
      {status}
    </div>
  );
};

export default SpotifySuccess;
