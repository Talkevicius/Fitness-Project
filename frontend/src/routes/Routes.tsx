import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import NoMatchPage from "../pages/NoMatchPage/NoMatchPage";
import categoriesLoader from "./categoriesLoader";

// src/routes/Routes.tsx
import ExercisePage from "../pages/ExercisePage/ExercisePage";
import exercisesLoader from "./exercisesLoader";

import ExerciseDetailPage from "../pages/ExerciseDetailPage/ExerciseDetailPage.tsx";
import { exerciseDetailLoader } from "./exerciseDetailLoader";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "", // root page could be categories
                element: <CategoryPage />,
                loader: categoriesLoader,
            },
            {
                path: "exercises",
                element: <ExercisePage />,
                loader: exercisesLoader,
            },
        ],
    },
]);


export default router;
