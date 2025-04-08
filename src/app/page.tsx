"use client";

import FlipClock from "@/components/FlipClock/FlipClock";
import React from "react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-8">
      <FlipClock />
    </div>
  );
}
