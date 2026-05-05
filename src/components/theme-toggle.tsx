interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';

  // NOTE: theme toggle button is not required for now — commented out
  // return (
  //   <button
  //     className="theme-toggle"
  //     onClick={onToggle}
  //     aria-label={label}
  //     aria-pressed={isDark}
  //     title={label}
  //   >
  //     {icon}
  //   </button>
  // );

  void isDark; void label; void icon;
  return null;
}
