"use client";

import React, { useEffect, useState } from "react";
import FlipItemGroup from "../FlipItemGroup/FlipItemGroup";

export default function FlipClock() {
  const [seconds, setSeconds] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(1000);

  useEffect(() => {
    const interval = setInterval(() => {
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      let newDays = days;

      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = newMinutes - 1;
      }

      if (newMinutes < 0) {
        newMinutes = 59;
        newHours = newHours - 1;
      }

      if (newHours < 0) {
        newHours = 23;
        newDays = newDays - 1;
      }

      setSeconds(newSeconds);
      setMinutes(newMinutes);
      setHours(newHours);
      setDays(newDays);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div className="flex items-center gap-4">
      <FlipItemGroup value={days} label="days" />
      <div className="text-8xl mb-12">:</div>
      <FlipItemGroup value={hours} label="hours" />
      <div className="text-8xl mb-12">:</div>
      <FlipItemGroup value={minutes} label="minutes" />
      <div className="text-8xl mb-12">:</div>
      <FlipItemGroup value={seconds} label="seconds" />
    </div>
  );
}
