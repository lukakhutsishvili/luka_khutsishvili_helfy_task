export default function ThemeToggle({ theme, onChange }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => onChange(isDark ? 'light' : 'dark')}
    >
      <span>{isDark ? '☀' : '☾'}</span>
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
