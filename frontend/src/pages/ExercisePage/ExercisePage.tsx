import React, {useEffect, useState} from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./ExercisePage.module.css";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard.tsx";
import axios from "axios";
import {getUser, isAdmin} from "../../context/auth.ts";
import EditModal from "../../components/EditModal/EditModal.tsx";

interface Category {
    id: number;
    muscleGroup: string;
}
interface Exercise {
    id: number;
    name: string;
    description?: string;
    category?: {
        id: number;
        muscleGroup: string;
    } | null;
    userId?: number;
}

const API_URL = import.meta.env.VITE_API_URL;


const ExercisePage: React.FC = () => {
    const user = getUser();
    const canEditOrCreate = isAdmin() || Boolean(user?.id);

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
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
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

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/categories`);
                // Extract the items array
                const items = Array.isArray(res.data.items) ? res.data.items : [];
                setCategories(items);
            } catch (err) {
                console.error(err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);


    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.muscleGroup
    }));





    // CREATE function
    const handleCreateExercise = async (newExercise: {
        name: string;
        description?: string;
        categoryId: number;
    }) => {
        try {
            const res = await axios.post(`${API_URL}/api/exercises`, newExercise, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setExercises((prev) => [...prev, res.data]);
        } catch (err) {
            console.error(err);
            alert("Failed to create exercise");
        }
        setCreateModalOpen(false);
    };

    return (
        <div className={`${styles.exercisePage} ${styles.fadeDown}`}>
            <h1>Exercises</h1>
            
            <div className={styles.headingContainer}>
                {
                    canEditOrCreate && (
                        <>
                            <h2>Click this to</h2>
                            <button
                                className={styles.exerciseButton}
                                onClick={() => setCreateModalOpen(true)}
                            >
                                Add new Exercise
                            </button>
                        </>
                    )
                }
                
            </div>
            <div className={styles.exerciseGrid}>
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        id={exercise.id}
                        name={exercise.name}
                        description={exercise.description ?? ""}
                        categoryId={exercise.category?.id ?? 0}
                        muscleGroup={exercise.category?.muscleGroup}
                        authorId={exercise.userId ?? 0}
                        onDelete={deleteExercise}
                        onEdit={editExercise}
                    />
                ))}
            </div>
            {isCreateModalOpen && (
                <EditModal
                    isOpen={isCreateModalOpen}
                    initialValues={{ name: "", description: "", categoryId: 0 }}
                    fields={[
                        { key: "name", label: "Exercise Name", type: "text" },
                        { key: "description", label: "Description", type: "textarea" },
                        { key: "categoryId", label: "Category", type: "select", options: categoryOptions }
                    ]}

                    title="Add New Exercise"
                    onSave={(values) => {
                        handleCreateExercise({
                            name: values.name,
                            description: values.description,
                            categoryId: values.categoryId,
                        });
                        setCreateModalOpen(false);
                    }}
                    onCancel={() => setCreateModalOpen(false)}
                />
            )}

        </div>
    );
};

export default ExercisePage;
