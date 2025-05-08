// import FlipClock from "@/components/FlipClock/FlipClock";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen gap-8">
      <p className="text-9xl font-bold">Super Simple Countdowns</p>
      <div className="flex gap-2">
        <button className="btn btn-neutral btn-outline btn-lg">Explore</button>
        <button className="btn btn-primary btn-lg">Create</button>
      </div>
      {/* <FlipClock /> */}
    </div>
  );
}
