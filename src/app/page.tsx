"use client";

import ControlCenter from "components/ControlCenter";
import Stopwatch from "components/Stopwatch";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession({ required: true });

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2]">
      <Stopwatch />
      <ControlCenter />
    </main>
  );
}
