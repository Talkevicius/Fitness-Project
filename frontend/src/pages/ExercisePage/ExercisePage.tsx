import React from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./ExercisePage.module.css";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard.tsx"

export interface Exercise {
    id: number;
    name: string;
    description?: string;
    category?: {
        id: number;
        muscleGroup: string;
    } | null;
}

const ExercisePage: React.FC = () => {
    const exercises = useLoaderData() as Exercise[];
    return (
        <div className={`${styles.exercisePage} ${styles.fadeDown}`}>
            <h1>Exercises</h1>
            <div className={styles.exerciseGrid}>
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        name={exercise.name}
                        muscleGroup={exercise.category?.muscleGroup ?? "Unknown"}
                        description={exercise.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExercisePage;
