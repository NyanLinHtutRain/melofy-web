"use client";

import { Suspense } from "react";
import SigninContent from "./SigninContent";

const SigninPage = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading page...</div>}>
      <SigninContent />
    </Suspense>
  );
};

export default SigninPage;
