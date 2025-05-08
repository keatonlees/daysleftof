import FlipClock from "@/components/FlipClock/FlipClock";
import React from "react";

export default function Counter() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen gap-8">
      <FlipClock />
    </div>
  );
}
