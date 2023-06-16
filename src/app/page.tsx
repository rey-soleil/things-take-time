"use client";

import { useSession } from "next-auth/react";
import Stopwatch from "../../components/Stopwatch";

export default function Home() {
  const { data: session } = useSession({ required: true });

  // TODO: save #F2F2F2 as a CSS variable
  return <main className="h-screen w-screen bg-[#F2F2F2]">
    <Stopwatch/>
  </main>;
}
