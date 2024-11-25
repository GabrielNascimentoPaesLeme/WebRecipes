import { createContext, useReducer } from "react";
import recipes from "../data/dataRecipes";

const STAGES = ["Home", "Login", "Register", "Perfil"];

const initialState = {
  page: STAGES[0],
  recipes,
  favorite: false,
};

recipeReducer = (state, action) => {
  switch (action.type) {
    case value:
    default:
      return state;
  }
};

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const value = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};
