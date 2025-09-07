import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "./App.css";
import { useTheme } from "./hooks/useTheme";

const App = () => {
  const [isDark] = useTheme();
  return (
    <div className={isDark ? "dark" : ""}>
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
