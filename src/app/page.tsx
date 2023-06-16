"use client";

import ControlCenter from "components/ControlCenter";
import Stopwatch from "components/Stopwatch";
import { useState } from "react";

export default function Home() {
  const [startTime, setStartTime] = useState<number | undefined>();

  // TODO: save #F2F2F2 as a CSS variable
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F2F2]">
      <Stopwatch startTime={startTime} />
      <ControlCenter setStartTime={setStartTime} />
    </main>
  );
}
