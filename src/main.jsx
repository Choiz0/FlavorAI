import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Intro from "./pages/Intro";

import MyRecipeList from "./pages/MyRecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import EditRecipe from "./pages/EditRecipe";
import CreateRecipe from "./pages/CreateRecipe";
import Homepage from "./pages/Homepage";
import Layout2 from "./components/Layout2";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Intro />,
      },
      {
        path: "homepage",
        element: <Homepage />,
      },

      {
        path: "myrecipe",
        element: <Layout2 />,
        children: [
          {
            index: true,
            element: <MyRecipeList />,
          },
          {
            path: ":recipeId",

            element: <RecipeDetail />,
          },
          {
            path: "edit/:recipeId",
            element: <EditRecipe />,
          },
        ],
      },
      {
        path: "addNewRecipe",
        element: <CreateRecipe />,
      },
    ],
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </QueryClientProvider>
  </AuthProvider>
);
