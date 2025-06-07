"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";

const SigninContent = () => {
  const router = useRouter();
  const searchParamsInstance = useSearchParams();

  const [callbackUrl, setCallbackUrl] = useState("/");
  const [initialError, setInitialError] = useState<string | null>(null);

  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParamsInstance) {
      const cbUrl = searchParamsInstance.get("callbackUrl");
      setCallbackUrl(cbUrl || "/");

      const errorParamValue = searchParamsInstance.get("error");
      if (typeof errorParamValue === "string") {
        if (errorParamValue === "CredentialsSignin") {
          setInitialError("Invalid email or password. Please try again.");
        } else if (errorParamValue === "OAuthAccountNotLinked") {
          setInitialError("This email is already associated with another login method. Try signing in with that method.");
        } else {
          setInitialError("An authentication error occurred. Please try again.");
        }
      }
    }
  }, [searchParamsInstance]);

  useEffect(() => {
    if (initialError) {
      setFormError(initialError);
      setInitialError(null);
    }
  }, [initialError]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setFormError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
    setIsSubmitting(false);
  };

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

export default SigninContent;
