import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import axios from "axios";

const token = localStorage.getItem("token");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const root = document.getElementById("root")!;

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
