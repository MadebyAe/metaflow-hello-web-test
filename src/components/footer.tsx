interface FooterProps {
  remainingCount: number;
  completedCount: number;
  onClear: () => void;
}

export function Footer({ remainingCount, completedCount, onClear }: FooterProps) {
  const statusText =
    remainingCount > 0 || completedCount > 0
      ? `${remainingCount} task${remainingCount !== 1 ? 's' : ''} remaining`
      : '';

  return (
    <footer id="status">
      {statusText && <span>{statusText}</span>}
      {completedCount > 0 && (
        <button onClick={onClear}>Clear completed</button>
      )}
    </footer>
  );
}