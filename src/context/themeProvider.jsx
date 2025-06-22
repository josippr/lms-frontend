import { createContext, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../redux/actions/config"; 

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.config.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: (newTheme) => dispatch(setTheme(newTheme)) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);