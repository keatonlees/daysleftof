import React, { useEffect, useState } from "react";
import FlipItem from "../FlipItem/FlipItem";

export default function FlipClock() {
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(59);
  const [hours, setHours] = useState(23);

  useEffect(() => {
    const interval = setInterval(() => {
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;

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
      }

      setSeconds(newSeconds);
      setMinutes(newMinutes);
      setHours(newHours);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-4">
          <FlipItem digit={Math.floor(hours / 10)} />
          <FlipItem digit={hours % 10} />
        </div>
        <div className="text-center">hours</div>
      </div>

      <div className="text-8xl mb-12">:</div>

      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-4">
          <FlipItem digit={Math.floor(minutes / 10)} />
          <FlipItem digit={minutes % 10} />
        </div>
        <div className="text-center">minutes</div>
      </div>

      <div className="text-8xl mb-12">:</div>

      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-4">
          <FlipItem digit={Math.floor(seconds / 10)} />
          <FlipItem digit={seconds % 10} />
        </div>
        <div className="text-center">seconds</div>
      </div>
    </div>
  );
}
