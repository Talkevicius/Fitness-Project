import * as jwtDecode from "jwt-decode";
// src/auth.ts
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

