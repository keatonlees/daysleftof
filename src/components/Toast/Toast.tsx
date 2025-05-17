import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

export default function Toast({
  message,
  isVisible,
  onClose,
  type = "success",
}: ToastProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsFading(false);
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for fade out animation to complete
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-info",
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${bgColor} text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 transform ${
          isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          ✕
        </button>
      </div>
    </div>
  );
}
