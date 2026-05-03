interface FooterProps {
  remainingCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function Footer({ remainingCount, completedCount, onClearCompleted }: FooterProps) {
  const statusText = remainingCount > 0 || completedCount > 0
    ? `${remainingCount} task${remainingCount !== 1 ? 's' : ''} remaining`
    : '';

  return (
    <footer id="status">
      {statusText && <span>{statusText}</span>}
      {completedCount > 0 && (
        <button onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
      <span className="version-badge">v1.0.0</span>
    </footer>
  );
}