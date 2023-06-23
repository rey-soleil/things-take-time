"use client";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center rounded-md border border-solid border-black p-5 [&>*]:p-4">
        <p>
          Things Take Time is a web app for tracking how you spend your time.
        </p>
        <p>
          Log in to get a custom Google Calendar with every event you&apos;ve
          ever tracked.
        </p>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}
