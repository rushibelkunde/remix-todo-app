// app/components/ui/modal.tsx
// Reusable confirmation/content modal with backdrop blur.

interface ModalProps {
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  dangerous?: boolean;
}

export default function Modal({
  title,
  body,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  dangerous = false,
}: ModalProps) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal-card">
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${dangerous ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
