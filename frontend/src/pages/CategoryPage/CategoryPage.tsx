import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import styles from "./CategoryPage.module.css";

interface Category {
    Id: number;
    MuscleGroup: string;
}

const CategoryPage = () => {
    const categories = useLoaderData() as Category[];

    return (
        <div className={styles.grid}>
            {categories.map((cat) => (
                <Link
                    key={cat.Id}
                    to={`/categories/${cat.Id}/exercises`} // link to exercises page for this category
                    className={styles.card}
                >
                    <h3>{cat.MuscleGroup}</h3>
                </Link>
            ))}
        </div>
    );
};

export default CategoryPage;
