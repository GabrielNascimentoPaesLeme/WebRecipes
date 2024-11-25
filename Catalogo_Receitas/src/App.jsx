import "./App.css";
import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";

/* import recipes from "./data/dataRecipes"; */
import { RecipeContext } from "./context/ContextRecipes";
import { ThemeProvider } from "./context/ThemeContext";
import NavBar from "./components/NavBar";

function App() {
  const { state } = useContext(RecipeContext);

  return (
    <ThemeProvider>
      <div>
        {/* Navbar */}
        {state.page === "Home" && <NavBar />}

        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
