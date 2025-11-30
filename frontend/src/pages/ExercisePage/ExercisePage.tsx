import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./ExercisePage.module.css";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard.tsx";
import axios from "axios";

interface Exercise {
    id: number;
    name: string;
    description?: string;
    category?: {
        id: number;
        muscleGroup: string;
    } | null;
    ownerId?: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const ExercisePage: React.FC = () => {
    // Load exercises from loader
    const loadedExercises = useLoaderData() as Exercise[];

    // Keep state locally so we can update UI
    const [exercises, setExercises] = useState(loadedExercises);

    // DELETE function
    const deleteExercise = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/api/exercises/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete exercise");
        }
    };

    // EDIT function
    const editExercise = async (updatedExercise: {
        id: number;
        name: string;
        description?: string;
        categoryId: number;
    }) => {
        try {
            const res = await axios.put(
                `${API_URL}/api/exercises/${updatedExercise.id}`,
                updatedExercise,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const updated = res.data;

            // Update UI state
            setExercises((prev) =>
                prev.map((ex) => (ex.id === updated.id ? { ...ex, ...updated } : ex))
            );
        } catch (err) {
            console.error(err);
            alert("Failed to edit exercise");
        }
    };

    return (
        <div className={`${styles.exercisePage} ${styles.fadeDown}`}>
            <h1>Exercises</h1>
            <div className={styles.exerciseGrid}>
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        id={exercise.id}
                        name={exercise.name}
                        description={exercise.description ?? ""}
                        categoryId={exercise.category?.id ?? 0}
                        muscleGroup={exercise.category?.muscleGroup}
                        authorId={exercise.ownerId ?? 0}
                        onDelete={deleteExercise}
                        onEdit={editExercise}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExercisePage;
