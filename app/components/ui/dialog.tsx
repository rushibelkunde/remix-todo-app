// app/components/ui/dialog.tsx
// Generic dialog shell — used by any popup/form modal throughout the app.
// Distinct from Modal (which is confirm-only): Dialog supports arbitrary children.

import { useEffect } from "react";

interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  icon?: string;
}

export default function Dialog({
  title,
  onClose,
  children,
  size = "md",
  icon,
}: DialogProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const maxWidths: Record<string, string> = {
    sm: "360px",
    md: "480px",
    lg: "600px",
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="dialog-card"
        style={{ maxWidth: maxWidths[size] }}
      >
        <div className="dialog-header">
          <div className="dialog-title-row">
            {icon && <span className="dialog-icon">{icon}</span>}
            <h2 id="dialog-title" className="dialog-title">{title}</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}
