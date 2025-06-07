"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SignupContent = () => {
  const router = useRouter();
  const searchParamsInstance = useSearchParams();

  const [callbackUrl, setCallbackUrl] = useState("/");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (searchParamsInstance) {
      const cbUrl = searchParamsInstance.get("callbackUrl");
      setCallbackUrl(cbUrl || "/");
    }
  }, [searchParamsInstance]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  if (status === "authenticated") {
    return <div className="flex min-h-screen items-center justify-center">Redirecting...</div>;
  }

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      {/* ... your full JSX exactly the same here ... */}
      {/* Just copy your section content here — no change needed */}
    </section>
  );
};

export default SignupContent;
