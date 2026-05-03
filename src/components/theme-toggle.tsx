interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = isDark ? '☀️' : '🌙';

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {icon}
    </button>
  );
}
