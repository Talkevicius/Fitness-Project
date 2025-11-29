import React from "react";
import styles from "./ExerciseCard.module.css"; 

export interface ExerciseCardProps {
    name: string;
    muscleGroup?: string | null;
    description?: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ name, muscleGroup, description }) => {
    return (
        <div className={styles.exerciseCard}>
            <h2>{name}</h2>
            <p>Muscle Group: {muscleGroup ?? "Unknown"}</p>
            {description && <p>{description}</p>}
        </div>
    );
};

export default ExerciseCard;
