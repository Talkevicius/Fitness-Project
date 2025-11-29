// src/pages/ExercisePage/ExercisePage.tsx
import React from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./ExercisePage.module.css";


export interface Exercise {
    id: number;
    name: string;
    description?: string;
    category?: {
        id: number;
        muscleGroup: string;
    } | null;
}


export interface PaginatedExercises {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    items: Exercise[];
}

const ExercisePage: React.FC = () => {
    const exercises = useLoaderData() as Exercise[];

    return (
        <div className={styles.exercisePage}>
            <h1>Exercises</h1>
            <div className={styles.exerciseGrid}>
                {exercises.map((exercise) => (
                    <div key={exercise.id} className={styles.exerciseCard}>
                        <h2>{exercise.name}</h2>
                        <p>
                            Muscle Group: {exercise.category?.muscleGroup ?? "Unknown"}
                        </p>
                        {exercise.description && <p>{exercise.description}</p>}
                    </div>

                ))}
            </div>
        </div>
    );
};

export default ExercisePage;
