// app/components/ui/empty-state.tsx
// Shown when a list has no items to display.

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

export default function EmptyState({
  message = "Nothing here yet.",
  icon = "📭",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <p className="empty-state-text">{message}</p>
    </div>
  );
}
