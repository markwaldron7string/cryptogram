import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "cryptogram-theme";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(STORAGE_KEY) || "dark";
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
