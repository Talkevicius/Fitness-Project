import React, { useState } from 'react';
import styles from './MainLayout.module.css';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1>Fitness Project</h1>

                {/* Nav links */}
                <nav>
                    <div
                        className={`${styles.navLinks} ${
                            menuOpen ? styles.navLinksActive : ''
                        }`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>
                            HomePage
                        </Link>
                        <Link to="/categories" onClick={() => setMenuOpen(false)}>
                            Categories
                        </Link>
                        <Link to="/exercises" onClick={() => setMenuOpen(false)}>
                            Exercises
                        </Link>
                    </div>

                    {/* Hamburger */}
                    <div className={styles.hamburger} onClick={toggleMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <main className={styles.main}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                &copy; 2025 Fitness Project
            </footer>
        </div>
    );
};

export default MainLayout;
