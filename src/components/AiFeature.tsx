"use client";

import { useState } from "react";

const AiFeature = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("");
  const [taste, setTaste] = useState("");
  const [sampleSong, setSampleSong] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlaylist = async () => {
    setLoading(true);
    setPlaylist([]);
    setError("");

    try {
      // Step 1: Call OpenAI backend to generate playlist
      const res = await fetch("https://nlwpifw1n2.execute-api.us-east-1.amazonaws.com/prod/generate-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, duration, taste, sampleSong }),
      });

      const data = await res.json();
      const text = data.playlistText || "";

      const parsed = text
        .split("\n")
        .filter((line) => line.includes(" - "))
        .map((line) => {
          const parts = line.split(/ - | – /);
          const title = parts[0]?.trim().replace(/^\d+\.\s*/, ""); // 👈 strip number-dot
          const artist = parts[1]?.trim() || "Unknown";
          return { title, artist };
        });

      setPlaylist(parsed);

      // Step 2: Save to DynamoDB before Spotify login
      const prepare = await fetch("https://nlwpifw1n2.execute-api.us-east-1.amazonaws.com/prod/prepare-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          songs: parsed,
          duration,
          taste,
        }),
      });

      const prepareData = await prepare.json();
      if (!prepare.ok || !prepareData.tempId) {
        throw new Error("Failed to save playlist. Try again.");
      }

      const tempId = prepareData.tempId;

      // Step 3: Redirect to Spotify login with state=tempId
      window.location.href = `/api/login?id=${tempId}`;
    } catch (err) {
      console.error("Error generating or preparing playlist:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden bg-[#171C28] py-16 md:py-20 lg:py-28">
      <div className="container mx-auto">
        <div className="text-center mx-auto mb-[60px] max-w-[510px]">
          <h2 className="text-white text-3xl font-bold mb-4">Melofy AI Playlist Generator</h2>
          <p className="text-body-color">
            Describe your vibe and generate the perfect playlist instantly.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vibe..."
            className="w-full rounded-md border border-[#3A3A3A] bg-[#1E293B] py-3 px-6 text-base text-white placeholder-body-color focus:border-primary focus-visible:outline-none"
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="How many minutes? (optional)"
            className="w-full rounded-md border border-[#3A3A3A] bg-[#1E293B] py-3 px-6 text-base text-white placeholder-body-color focus:border-primary focus-visible:outline-none"
          />

          <select
            aria-label="Select taste"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
            className="w-full rounded-md border border-[#3A3A3A] bg-[#1E293B] py-3 px-6 text-base text-white shadow-md focus:border-primary focus-visible:outline-none"
          >
            <option value="">Choose a taste (optional)</option>
            <option value="trending">Trending</option>
            <option value="underrated">Underrated</option>
            <option value="romantic">Romantic</option>
            <option value="chill">Chill</option>
            <option value="motivational">Motivational</option>
            <option value="energetic">Energetic</option>
            <option value="relaxing">Relaxing</option>
            <option value="party">Party</option>
            <option value="focus">Focus</option>
            <option value="mixed">Mixed</option>
          </select>

          <input
            value={sampleSong}
            onChange={(e) => setSampleSong(e.target.value)}
            placeholder="Sample Song (optional)"
            className="w-full rounded-md border border-[#3A3A3A] bg-[#1E293B] py-3 px-6 text-base text-white placeholder-body-color focus:border-primary focus-visible:outline-none"
          />

          <button
            onClick={generatePlaylist}
            className={`w-full rounded-md py-3 px-6 text-white font-semibold transition ${
              loading ? "bg-gray-500" : "bg-primary hover:bg-opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate + Send to Spotify"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {playlist.length > 0 && (
            <div className="space-y-2">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className="p-4 border border-[#3A3A3A] bg-[#1E293B] rounded text-white font-medium hover:bg-[#334155] transition"
                >
                  <p className="text-base leading-relaxed">
                    {song.title} - {song.artist}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiFeature;
