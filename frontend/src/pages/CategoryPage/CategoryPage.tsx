import React from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./CategoryPage.module.css";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

interface Category {
    id: number;
    muscleGroup: string;
}

const CategoryPage: React.FC = () => {
    const categories = useLoaderData() as Category[];

    return (
        <div className={`${styles.categoryPage} ${styles.fadeDown}`}>
            <h1>Categories</h1>

            <div className={styles.categoryGrid}>
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        id={category.id}
                        muscleGroup={category.muscleGroup}
                    />

                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
