import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
    id: number;
    muscleGroup: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, muscleGroup }) => {
    const navigate = useNavigate();

    return (
        <div
            className={styles.categoryCard}
            onClick={() => navigate(`/categories/${id}`)}
            style={{ cursor: "pointer" }} // optional, to show pointer on hover
        >
            <h2>{muscleGroup}</h2>
        </div>
    );
};

export default CategoryCard;
