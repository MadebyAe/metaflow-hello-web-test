interface FooterProps {
  remainingCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function Footer({ remainingCount, completedCount, onClearCompleted }: FooterProps) {
  return (
    <footer id="status" aria-live="polite">
      {remainingCount > 0 || completedCount > 0 ? (
        <span id="status-text">
          {remainingCount} task{remainingCount !== 1 ? 's' : ''} remaining
        </span>
      ) : null}
      {completedCount > 0 && (
        <button id="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}