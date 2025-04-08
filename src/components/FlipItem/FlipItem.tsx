import React, { useEffect, useState } from "react";
import "./FlipItem.sass";

export default function FlipItem({ digit }: { digit: number }) {
  const [curDigit, setCurDigit] = useState(digit);
  const [prevDigit, setPrevDigit] = useState(digit);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setPrevDigit(curDigit);
      setCurDigit(digit);
      setAnimate(true);

      const timer = setTimeout(() => {
        setAnimate(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <div className="flip-item">
      <div className="card-top">
        <span>{curDigit}</span>
      </div>

      {animate && (
        <>
          <div className={`card-top-flipping ${animate ? "fold-card" : ""}`}>
            <span>{prevDigit}</span>
          </div>

          <div className={`card-bot-flipping ${animate ? "unfold-card" : ""}`}>
            <span>{curDigit}</span>
          </div>
        </>
      )}

      <div className="card-bot">
        <span>{animate ? prevDigit : curDigit}</span>
      </div>
    </div>
  );
}
