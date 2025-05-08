import getDigitArray from "@/util/getDigitArray";
import React from "react";
import FlipItem from "../FlipItem/FlipItem";

export default function FlipItemGroup({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const digits = getDigitArray(value);

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex gap-4">
        {digits.map((digit, i) => {
          return <FlipItem digit={digit} key={i} />;
        })}
      </div>
      <div className="text-center">{label}</div>
    </div>
  );
}
