import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const AuthPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const mode = searchParams.get("mode") || "login";
    const [animationClass, setAnimationClass] = useState("");

    // Track previous mode to determine direction
    const [prevMode, setPrevMode] = useState(mode);

    useEffect(() => {
        if (prevMode !== mode) {
            if (mode === "register") {
                setAnimationClass(styles.slideRight);
            } else {
                setAnimationClass(styles.slideLeft);
            }
            setPrevMode(mode);
        }
    }, [mode]);

    const switchMode = (newMode: "login" | "register") => {
        navigate(`/auth?mode=${newMode}`);
    };

    const isLogin = mode === "login";

    return (
        <div className={styles.authContainer}>
            <div className={styles.card}>

                {/* Toggle buttons */}
                <div className={styles.toggle}>
                    <button
                        className={isLogin ? styles.active : ""}
                        onClick={() => switchMode("login")}
                    >
                        Sign In
                    </button>

                    <button
                        className={!isLogin ? styles.active : ""}
                        onClick={() => switchMode("register")}
                    >
                        Register
                    </button>
                </div>

                {/* Sliding animation wrapper */}
                <div className={styles.slideContainer}>
                    <div className={`${styles.slide} ${animationClass}`}>
                        <h2>{isLogin ? "Welcome Back" : "Create an Account"}</h2>
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
