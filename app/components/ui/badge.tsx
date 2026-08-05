// app/components/ui/badge.tsx
// Status badge — renders a colored pill for todo/subtodo statuses.

import type { TodoStatus } from "~/types";

interface BadgeProps {
  status: TodoStatus;
}

const STATUS_LABELS: Record<TodoStatus, string> = {
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

const STATUS_CLASS: Record<TodoStatus, string> = {
  IN_PROGRESS: "badge badge-in-progress",
  ON_HOLD: "badge badge-on-hold",
  COMPLETED: "badge badge-completed",
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={STATUS_CLASS[status]}>
      {STATUS_LABELS[status]}
    </span>
  );
}
