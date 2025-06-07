// src/app/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected import for App Router
import { useEffect } from "react"; // Removed underscore from useEffect
import Image from "next/image";
import Link from "next/link"; // For a "Go Home" link or similar

// You can add Metadata if needed, similar to other pages
// import { Metadata } from "next";
// export const metadata: Metadata = { title: "My Profile | Melofy" };

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If status is not loading and there's no session (unauthenticated)
    if (status !== "loading" && !session) {
      router.push("/signin?callbackUrl=/profile"); // Redirect to sign-in, then back to profile
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center text-lg">Loading profile...</div>;
  }

  if (!session || !session.user) {
    // This might show briefly before redirect, or if something unexpected happens
    return (
      <div className="flex h-screen flex-col items-center justify-center text-lg">
        <p>Please sign in to view your profile.</p>
        <Link href="/signin" className="mt-4 text-primary hover:underline">Go to Sign In</Link>
      </div>
    );
  }

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28 dark:bg-gray-dark">
      <div className="container">
        <div className="mx-auto max-w-lg rounded-sm bg-white p-8 py-10 shadow-three dark:bg-dark sm:p-12 md:px-8 xl:p-10">
          <h1 className="mb-8 text-center text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Your Profile
          </h1>
          <div className="mb-8 space-y-4 text-center">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={`${session.user.name || 'User'}'s avatar`}
                width={100}
                height={100}
                className="mx-auto mb-5 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium text-body-color dark:text-body-color-dark">Name:</p>
              <p className="text-lg text-black dark:text-white">
                {session.user.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-body-color dark:text-body-color-dark">Email:</p>
              <p className="text-lg text-black dark:text-white">
                {session.user.email || "Not provided"}
              </p>
            </div>
            {/* Display more user info from session if available, e.g., user ID for debugging */}
            {/* <p className="text-sm text-body-color dark:text-body-color-dark">ID: {(session.user as any).id}</p> */}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => signOut({ callbackUrl: '/' })} // Sign out and redirect to homepage
              className="rounded-sm bg-red-600 px-8 py-3 text-base font-medium text-white shadow-md transition duration-300 ease-in-out hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;