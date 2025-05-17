import { Save } from "lucide-react";
import React from "react";

interface SaveButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function SaveButton({
  onClick,
  isLoading = false,
  disabled = false,
}: SaveButtonProps) {
  return (
    <button
      className="btn btn-xs xl:btn-md btn-success"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <>
          <Save />
          Save
        </>
      )}
    </button>
  );
}
