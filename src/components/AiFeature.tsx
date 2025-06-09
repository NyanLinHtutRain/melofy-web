"use client";

import { useState } from "react";
import Image from "next/image"; // This import is correct

const AiFeature = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("");
  const [taste, setTaste] = useState("");
  const [sampleSong, setSampleSong] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]); // This declaration is fine
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempId, setTempId] = useState(""); // NEW

  const generatePlaylist = async () => {
    setLoading(true);
    setPlaylist([]);
    setError("");
    setTempId(""); // Reset tempId at start

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
        .filter((line: string | string[]) => line.includes(" - "))
        .map((line: string) => {
          const parts = line.split(/ - | – /);
          const title = parts[0]?.trim().replace(/^\d+\.\s*/, "");
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
      setTempId(tempId); // NEW → store tempId instead of auto-redirect
    } catch (err) {
      console.error("Error generating or preparing playlist:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="ai-feature"
      className="relative z-10 overflow-hidden bg-white py-16 dark:bg-gray-dark md:py-20 lg:py-28"
    >
      <div className="container mx-auto">
        <div className="mx-auto mb-[60px] max-w-[600px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px]">
            Melofy AI Playlist Generator
          </h2>
          <p className="text-base text-body-color dark:text-body-color-dark">
            Describe your vibe and generate the perfect playlist instantly.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vibe..."
            className="w-full rounded-md border border-stroke bg-transparent px-6 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-stroke-dark dark:text-body-color-dark dark:placeholder:text-body-color-dark"
            rows={4}
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="How many minutes? (optional)"
            className="w-full rounded-md border border-stroke bg-transparent px-6 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-stroke-dark dark:text-body-color-dark dark:placeholder:text-body-color-dark"
          />

          <div className="relative">
            <select
              aria-label="Select taste"
              value={taste}
              onChange={(e) => setTaste(e.target.value)}
              className="w-full appearance-none rounded-md border border-stroke bg-transparent px-6 py-3 text-base text-body-color shadow-md outline-none focus:border-primary focus-visible:shadow-none dark:border-stroke-dark dark:text-body-color-dark"
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
            <span className="pointer-events-none absolute right-4 top-1/2 z-10 mt-[-2px] h-2 w-2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color dark:border-body-color-dark"></span>
          </div>

          <input
            value={sampleSong}
            onChange={(e) => setSampleSong(e.target.value)}
            placeholder="Sample Song (optional)"
            className="w-full rounded-md border border-stroke bg-transparent px-6 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-stroke-dark dark:text-body-color-dark dark:placeholder:text-body-color-dark"
          />

          <button
            onClick={generatePlaylist}
            className={`w-full rounded-md bg-primary px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-primary/80 ${
              loading ? "cursor-not-allowed bg-opacity-70" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Playlist"}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {playlist.length > 0 && (
            <div className="mt-8 space-y-3 rounded-md bg-gray-light p-4 dark:bg-dark">
              <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">Generated Playlist:</h3>
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className="rounded p-3 text-sm text-body-color dark:text-body-color-dark"
                >
                  {song.title} - {song.artist}
                </div>
              ))}
            </div>
          )}

          {tempId && (
            <div className="mt-6 space-y-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/public-sync?id=${tempId}`);
                    const data = await res.json();
                    if (data.publicSpotifyUrl) {
                      window.open(data.publicSpotifyUrl, "_blank");
                    } else {
                      alert("Failed to create public playlist.");
                    }
                  } catch (err) {
                    console.error("Public sync error:", err);
                    alert("Error creating public playlist.");
                  }
                }}
                className="w-full rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-green-700"
              >
                View Public Playlist
              </button>

              <button
                onClick={() => {
                  window.location.href = `/api/login?id=${tempId}`;
                }}
                className="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700"
              >
                Export to My Spotify
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-[-60px] left-1/2 z-[-1] w-full max-w-[1024px] -translate-x-1/2 transform md:bottom-[-80px] lg:max-w-[1280px] xl:max-w-[1440px]"
      >
        <Image
          src="/images/hero/shape-03.svg"
          alt="Decorative wave lines background"
          width={1440}
          height={560}
          className="h-auto w-full opacity-20 dark:opacity-15"
        />
      </div>
    </section>
  );
};

export default AiFeature;
