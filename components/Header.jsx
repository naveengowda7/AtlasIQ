import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const [isDark, setIsDark] = useTheme();

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Where in the world?
          </a>
        </h1>
        <div className="theme-toggle" onClick={handleThemeToggle}>
          <i className={`fa-solid fa-${isDark ? "sun" : "moon"}`} />
          <span>{isDark ? "Light" : "Dark"} Mode</span>
        </div>
      </div>
    </header>
  );
}
