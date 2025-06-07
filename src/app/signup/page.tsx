"use client";

import { Suspense } from "react";
import SignupContent from "./SignupContent";

const SignupPage = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading page...</div>}>
      <SignupContent />
    </Suspense>
  );
};

export default SignupPage;
