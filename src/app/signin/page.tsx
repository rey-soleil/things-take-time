"use client";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => signIn("google", { callbackUrl })}>
        Sign in With Google
      </Button>
    </div>
  );
}
