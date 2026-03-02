function ThemeToggle({ isDark, onToggle }) {
  return (
    <button 
      className="theme-toggle" 
      onClick={onToggle}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-icon">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

export default ThemeToggle;






