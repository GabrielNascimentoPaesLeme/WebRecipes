import { createContext, useState, useEffect } from "react";

// Cria o contexto para o tema
export const ThemeContext = createContext();

// Provider do contexto
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Função para alternar o tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme)
    document.body.className = newTheme; // Adiciona a classe ao body para alterar o estilo globalmente
  };

  // Aplicar o tema no início com base no estado
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    console.log(savedTheme)
    if(savedTheme) {
      setTheme(savedTheme)
      document.body.className = savedTheme;
    } else{
      document.body.className = theme;
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
