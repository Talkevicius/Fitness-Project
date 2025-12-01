import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`${API_URL}/api/users/register`, {
                username,
                email,
                password
            });

            if (!res.data.token) {
                setError("Registration failed: no token received.");
                return;
            }

            const user = {
                id: res.data.id,
                username: res.data.username,
                role: res.data.role
            };

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", res.data.token);

            // Attach token to all future axios requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

            // Redirect home
            navigate("/");

        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || "Registration failed";
            setError(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
