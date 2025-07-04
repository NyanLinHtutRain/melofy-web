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
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Create your Melofy account
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                It’s totally free and super easy
              </p>
              <button
                onClick={() => signIn("google", { callbackUrl: callbackUrl })}
                className="mb-6 flex w-full items-center justify-center rounded-sm border px-6 py-3 text-base font-medium outline-none transition-colors duration-200 ease-in-out
                           bg-white text-gray-700 border-gray-300 hover:bg-gray-100 
                           dark:bg-[#2C303B] dark:text-gray-200 dark:border-gray-600 dark:hover:bg-[#3a3f4e]
                           focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark"
              >
                <span className="mr-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_signup_google)"> {/* Changed ID for potential uniqueness, though likely not an issue on separate pages */}
                      <path
                        d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_signup_google">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Sign up with Google
              </button>
              <div className="mb-8 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                <p className="w-full px-5 text-center text-base font-medium text-body-color">
                  {/* Placeholder text, no form yet */}
                </p>
                <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
              </div>
              <p className="text-body-color mb-6 text-center text-base">
                For now, please use Google to create an account. <br /> Email & Password signup is coming soon!
              </p>
              <p className="text-center text-base font-medium text-body-color">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupContent;