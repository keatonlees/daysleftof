import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const bgColor = "rgba(0,0,0,0.5)";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
