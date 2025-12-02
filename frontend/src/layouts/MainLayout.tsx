import { useState } from "react";
import styles from "./MainLayout.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button/Button"; // import your button component
import svg from "../assets/react.svg";

const MainLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/"); // redirect to homepage
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Fitness <span><img src={svg}></img></span> Project</h1>

                <nav>
                    <div
                        className={`${styles.navLinks} ${
                            menuOpen ? styles.navLinksActive : ""
                        }`}
                    >
                        <Button variant="tertiary" onClick={() => navigate("/")}>
                            HomePage
                        </Button>
                        <Button variant="tertiary" onClick={() => navigate("/categories")}>
                            Categories
                        </Button>
                        <Button variant="tertiary" onClick={() => navigate("/exercises")}>
                            Exercises
                        </Button>

                        {!token ? (
                            <>
                                <Button variant="tertiary" onClick={() => navigate("/auth?mode=login")}>
                                    Sign In
                                </Button>
                                <Button variant="tertiary" onClick={() => navigate("/auth?mode=register")}>
                                    Register
                                </Button>
                            </>
                        ) : (
                            <Button variant="tertiary" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </div>

                    <div className={styles.hamburger} onClick={toggleMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </nav>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>&copy; 2025 Fitness Project - V1.1</footer>
        </div>
    );
};

export default MainLayout;
