//import * as jwtDecode from "jwt-decode";
// src/auth.ts
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export const getUser = (): User | null => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : null;
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === "admin";
};

export const isLoggedIn = (): boolean => {
    return !!getUser();
};

export const getUsernameById = async (userId: number): Promise<string> => {
    try {
        const res = await axios.get(`${API_URL}/api/users/${userId}/username`);
        return res.data.username;
    } catch {
        return "Unknown";
    }
};

