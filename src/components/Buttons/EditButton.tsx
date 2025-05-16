import { Pencil } from "lucide-react";
import React from "react";

interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      <Pencil />
      Edit
    </button>
  );
}
