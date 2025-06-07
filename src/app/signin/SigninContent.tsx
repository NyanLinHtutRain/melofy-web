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
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Sign in to Melofy
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Access your AI-powered playlists.
              </p>
              <button
                onClick={() => signIn("google", { callbackUrl: callbackUrl })}
                className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:hover:shadow-none">
                <span className="mr-3">G</span> {/* You can replace with your full Google Icon */}
                Sign in with Google
              </button>
              <div className="mb-8 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                <p className="w-full px-5 text-center text-base font-medium text-body-color">
                  Or, sign in with your email
                </p>
                <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
              </div>
              {formError && (
                <p className="mb-4 rounded-sm bg-red-100 p-3 text-center text-sm text-red-700 dark:bg-red-700/20 dark:text-red-400">
                  {formError}
                </p>
              )}
              <form onSubmit={handleCredentialsSignIn}>
                <div className="mb-8">
                  <label htmlFor="email" className="text-dark mb-3 block text-sm font-medium dark:text-white">Your Email</label>
                  <input type="email" name="email" id="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"/>
                </div>
                <div className="mb-8">
                  <label htmlFor="password" className="text-dark mb-3 block text-sm font-medium dark:text-white">Your Password</label>
                  <input type="password" name="password" id="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"/>
                </div>
                <div className="mb-6">
                  <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-submit-dark">
                    {isSubmitting ? "Signing In..." : "Sign in"}
                  </button>
                </div>
              </form>
              <p className="text-center text-base font-medium text-body-color">
                Don’t you have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninContent;
