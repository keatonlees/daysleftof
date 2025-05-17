import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

interface DeleteButtonProps {
  onDelete: () => void;
  itemName: string;
  isLoading?: boolean;
}

export default function DeleteButton({
  onDelete,
  itemName,
  isLoading = false,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        className="btn btn-sm xl:btn-md btn-error flex-1"
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <Trash2 />
            Delete
          </>
        )}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onDelete}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      />
    </>
  );
}
