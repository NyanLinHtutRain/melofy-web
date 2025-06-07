/* eslint-disable react/no-unescaped-entities */

// src/app/about/page.tsx

import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"; // Import for SVGs

export const metadata: Metadata = {
  title: "About Melofy | AI-Powered Playlist Generation",
  description: "Learn more about Melofy, the AI-powered Spotify playlist generator, its mission, and the technology that brings your musical vibes to life.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Melofy"
        description="Discover the story and technology behind your personalized AI music curator."
      />

      {/* Section 1: What is Melofy? */}
      <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-dark md:py-20 lg:py-24">
        {/* Subtle SVG background - Top Right */}
        <div className="pointer-events-none absolute right-0 top-0 z-[-1] opacity-10 dark:opacity-20">
          <Image
            src="/images/hero/shape-01.svg" // Assuming this is the complex circle one
            alt="Decorative shape"
            width={300} // Scaled down
            height={370} // Scaled down
          />
        </div>
        <div className="container">
          <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] p-8 dark:bg-dark sm:p-12 md:p-10 lg:p-12 xl:p-10" data-wow-delay=".1s">
            <h2 className="mb-6 text-center text-3xl font-bold text-black dark:text-white sm:text-4xl">
              What is Melofy?
            </h2>
            <p className="text-center text-lg leading-relaxed text-body-color dark:text-body-color-dark md:text-xl">
              Melofy is an innovative web application designed to transform your musical inclinations into perfectly curated Spotify playlists.
              Ever had a specific mood, a vibe for an activity, or a fleeting musical thought you wished could turn into a playlist? Melofy makes it happen, effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Our Mission & How It Works - Two Column Layout */}
      <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-dark md:py-20 lg:py-24">
        {/* Subtle SVG background - Bottom Left */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-[-1] opacity-10 dark:opacity-20">
          <Image
            src="/images/hero/shape-02.svg" // Assuming this is the line-based one
            alt="Decorative lines"
            width={240} // Scaled down
            height={130} // Scaled down
          />
        </div>
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-stretch"> {/* items-stretch for equal height cards */}
            {/* Our Mission Card */}
            <div className="wow fadeInUp w-full px-4 lg:w-1/2" data-wow-delay=".15s">
              <div className="mb-10 flex h-full flex-col rounded-md bg-primary/[3%] p-8 shadow-lg hover:shadow-xl dark:bg-dark sm:p-10 md:mb-0 md:px-8 lg:p-10 xl:p-12"> {/* Changed background for consistency and contrast */}
                <h3 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Our Mission
                </h3>
                <p className="flex-grow text-base leading-relaxed text-body-color dark:text-body-color-dark"> {/* flex-grow for text to take available space */}
                  We believe music discovery should be intuitive, personal, and enjoyable. Melofy empowers you to explore new sounds and rediscover old favorites by providing a smart, AI-driven tool that understands your unique tastes and moments. Our aim is to cut down the time spent manually building playlists, letting AI do the heavy lifting so you can just press play.
                </p>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="wow fadeInUp w-full px-4 lg:w-1/2" data-wow-delay=".2s">
              <div className="flex h-full flex-col rounded-md bg-primary/[3%] p-8 shadow-lg hover:shadow-xl dark:bg-dark sm:p-10 md:px-8 lg:p-10 xl:p-12"> {/* Changed background */}
                <h3 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  The Technology
                </h3>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  Melofy is built with a modern, serverless architecture:
                </p>
                <ul className="list-disc space-y-3 pl-5 text-base text-body-color dark:text-body-color-dark">
                  <li>
                    <strong>Frontend:</strong> Next.js & React, styled with Tailwind CSS.
                  </li>
                  <li>
                    <strong>AI Brains:</strong> OpenAI API (gpt-3.5-turbo) for prompt interpretation.
                  </li>
                  <li>
                    <strong>Music Service:</strong> Secure Spotify API integration (OAuth 2.0).
                  </li>
                  <li>
                    <strong>Backend:</strong> AWS Lambda functions via AWS API Gateway.
                  </li>
                  <li>
                    <strong>Data & Auth:</strong> AWS Cognito for user accounts (DynamoDB for future playlist history).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Journey So Far & Call to Action */}
      <section className="bg-white py-16 dark:bg-gray-dark md:py-20 lg:py-24">
        <div className="container">
          <div className="wow fadeInUp mx-auto max-w-3xl text-center" data-wow-delay=".2s">
            <h2 className="mb-8 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              The Journey So Far
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-body-color dark:text-body-color-dark">
              Melofy is an actively developing project. We've successfully implemented the core AI playlist generation and Spotify integration. We are committed to refining the user experience, completing the authenticated user flow, and adding more exciting features to help you discover music in a whole new way.
            </p>
            <Link
              href="/#ai-feature"
              className="ease-in-up shadow-btn hover:shadow-btn-hover rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90"
            >
              Try Melofy Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;