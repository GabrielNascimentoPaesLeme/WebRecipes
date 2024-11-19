import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RecipeProvider } from "./context/ContextRecipes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import Login from "./routes/Login.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import SearchResult from "./routes/SearchResult.jsx";
import FormRecipes from "./components/FormRecipes";
import CreateRecipe from "./routes/CreateRecipe.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Register from "./routes/Register.jsx";
import Favorites from "./routes/Favorites.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/",
        element: <FormRecipes />,
      },
      {
        path: "/search",
        element: <SearchResult />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/criacao",
        element: <CreateRecipe />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RecipeProvider>
      <RouterProvider router={router} />
    </RecipeProvider>
  </StrictMode>,
);
