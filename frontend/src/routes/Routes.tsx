import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage/HomePage.tsx"
import NoMatchPage from "../pages/NoMatchPage/NoMatchPage";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import categoriesLoader from "./categoriesLoader";
// src/routes/Routes.tsx
import ExercisePage from "../pages/ExercisePage/ExercisePage";
import exercisesLoader from "./exercisesLoader";

import exercisesByCategoryLoader from "./exercisesByCategoryLoader";
import AuthPage from "../pages/AuthPage/AuthPage.tsx";

import ComentsPage from "../pages/ComentsPage/ComentsPage";

import commentsLoader from "./comentsLoader.tsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "categories", 
                element: <CategoryPage />,
                loader: categoriesLoader,
            },
            {
                path: "exercises",
                element: <ExercisePage />,
                loader: exercisesLoader,
            },
            {
                path: "exercises/:exerciseId/comments",
                element: <ComentsPage />,
                // loader: commentsLoader,
            },
            {
                path: "/categories/:categoryId",
                element: <ExercisePage />,
                loader: exercisesByCategoryLoader,
            },
            {
                path: "/auth",
                element: <AuthPage />
            }

        ],
    },
]);


export default router;
