import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import styles from "./CategoryPage.module.css";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

interface Category {
    id: number;
    muscleGroup: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPage: React.FC = () => {
    const loadedCategories = useLoaderData() as Category[];

    // Local state so UI updates after edit/delete
    const [categories, setCategories] = useState(loadedCategories);

    // DELETE CATEGORY
    const handleDeleteCategory = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setCategories(prev => prev.filter(c => c.id !== id)); // remove from UI
        } catch (err) {
            console.error(err);
            alert("Failed to delete category");
        }
    };

    // EDIT CATEGORY
    const handleEditCategory = async (id: number, newName: string) => {
        try {
            const res = await axios.put(
                `${API_URL}/api/categories/${id}`,
                {
                    id: id,
                    muscleGroup: newName
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );


            const updated = res.data;

            // Update UI without refreshing
            setCategories(prev =>
                prev.map(cat =>
                    cat.id === id ? { ...cat, muscleGroup: updated.muscleGroup } : cat
                )
            );

        } catch (err) {
            console.error(err);
            alert("Failed to update category");
        }
    };

    return (
        <div className={`${styles.categoryPage} ${styles.fadeDown}`}>
            <h1>Categories</h1>
            <div className={styles.categoryGrid}>
                {categories.map(category => (
                    <CategoryCard
                        key={category.id}
                        id={category.id}
                        muscleGroup={category.muscleGroup}
                        onDelete={handleDeleteCategory}
                        onEdit={handleEditCategory}   // <-- pass function to card
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
