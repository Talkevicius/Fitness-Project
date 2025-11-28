// src/routes/Routes.js
import { createBrowserRouter } from "react-router-dom";
import CategoryPage from "../pages/CategoryPage/CategoryPage.tsx";
import NoMatchPage from "../pages/NoMatchPage/NoMatchPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import { ROUTES } from "./RoutePaths";

import axios from "axios";

export async function categoriesLoader() {
    const res = await axios.get("http://localhost:5214/api/categories");
    return res.data; // should return array of { Id, MuscleGroup }
}

// Router example
export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "categories",
                element: <CategoryPage />,
                loader: categoriesLoader,
            },
            // future routes like exercises or comments
        ],
    },
]);

