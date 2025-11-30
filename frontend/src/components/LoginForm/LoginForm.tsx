import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/users/login`, {
                username,
                password,
            });

            const token = response.data?.token;

            if (!token) {
                setError("Login failed: no token received.");
                return;
            }

            const user = {
                id: response.data.id,
                username: response.data.username,
                role: response.data.role
            };
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", response.data.token); // keep token separate



            // Attach token to all future axios requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Redirect home
            navigate("/");

        } catch (err: any) {
            console.error(err);
            setError("Invalid username or password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Sign In</button>
        </form>
    );
};

export default LoginForm;
