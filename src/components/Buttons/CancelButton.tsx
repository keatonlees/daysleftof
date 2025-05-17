import { X } from "lucide-react";
import React from "react";

interface CancelButtonProps {
  onClick: () => void;
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button className="btn btn-xs xl:btn-md btn-error" onClick={onClick}>
      <X />
      Discard
    </button>
  );
}
