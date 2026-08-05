// app/components/layout/app-header.tsx
// Sticky app header with brand, user greeting, and primary actions.

import { Form } from "@remix-run/react";

interface AppHeaderProps {
  userName: string;
  onToggleCategory: () => void;
  showCategory: boolean;
}

export default function AppHeader({
  userName,
  onToggleCategory,
  showCategory,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <div className="app-header-logo">✓</div>
        <span className="app-header-title">My Todos</span>
      </div>

      <div className="app-header-actions">
        <span className="app-header-user">Hey, {userName} 👋</span>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onToggleCategory}
          aria-expanded={showCategory}
        >
          {showCategory ? "✕ Categories" : "⊞ Categories"}
        </button>

        <Form method="POST">
          <button
            type="submit"
            name="action"
            value="logout"
            className="btn btn-ghost btn-sm"
          >
            Sign out
          </button>
        </Form>
      </div>
    </header>
  );
}
