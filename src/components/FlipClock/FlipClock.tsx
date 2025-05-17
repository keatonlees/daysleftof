"use client";

import React, { useEffect, useState } from "react";
import FlipItemGroup from "../FlipItemGroup/FlipItemGroup";

interface FlipClockProps {
  endDate: Date;
}

export default function FlipClock({ endDate }: FlipClockProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [timeLeft.seconds, endDate]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
      <FlipItemGroup value={timeLeft.days} label="days" />
      <div className="text-4xl md:text-6xl lg:text-8xl mb-12">:</div>
      <FlipItemGroup value={timeLeft.hours} label="hours" />
      <div className="text-4xl md:text-6xl lg:text-8xl mb-12">:</div>
      <FlipItemGroup value={timeLeft.minutes} label="minutes" />
      <div className="text-4xl md:text-6xl lg:text-8xl mb-12">:</div>
      <FlipItemGroup value={timeLeft.seconds} label="seconds" />
    </div>
  );
}
