import React from "react"; // If using React 17 or below, else optional in React 18+
import { useLoaderData } from "react-router-dom";
import styles from "./CategoryPage.module.css";

interface Category {
    id: number;
    muscleGroup: string;
}

const CategoryPage: React.FC = () => {
    const categories = useLoaderData() as Category[];

    return (
        <div className={styles.categoryPage}>
            <h1>Categories</h1>
            <div className={styles.categoryGrid}>
                {categories.map((category) => (
                    <div key={category.id} className={styles.categoryCard}>
                        <h2>{category.muscleGroup}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
