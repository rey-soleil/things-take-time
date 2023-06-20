"use client";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Sign in With Google
      </Button>
    </div>
  );
}
