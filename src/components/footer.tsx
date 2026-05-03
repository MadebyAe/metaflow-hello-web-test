interface FooterProps {
  totalTasksCount: number;
  remainingCount: number;
  completedCount: number;
  onClear: () => void;
}

export function Footer({ totalTasksCount, remainingCount, completedCount, onClear }: FooterProps) {
  const statusText = totalTasksCount === 0
    ? ''
    : `${remainingCount} task${remainingCount !== 1 ? 's' : ''} remaining`;

  return (
    <footer id="status">
      {statusText && <span>{statusText}</span>}
      <button
        id="clear-completed"
        onClick={onClear}
        hidden={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
}