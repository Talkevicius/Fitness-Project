import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ExerciseDetailPage.module.css";
import { useLoaderData } from "react-router-dom";


interface Exercise {
    id: number;
    name: string;
    description: string;
}

interface Comment {
    id: number;
    text: string;
    author: string;
}

const ExerciseDetailPage: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const exerciseRes = await axios.get<Exercise>(
                    `http://localhost:5214/api/exercises/${exerciseId}`
                );
                setExercise(exerciseRes.data);

                const commentsRes = await axios.get<Comment[]>(
                    `http://localhost:5214/api/exercises/${exerciseId}/comments`
                );
                setComments(commentsRes.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load exercise or comments");
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [exerciseId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!exercise) return <p>Exercise not found</p>;

    return (
        <div className={styles.exerciseDetailPage}>
            <h1>{exercise.name}</h1>
            <p>{exercise.description}</p>

            <div className={styles.commentsSection}>
                <h2>Comments</h2>
                {comments.length ? (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <strong>{comment.author}:</strong> {comment.text}
                        </div>
                    ))
                ) : (
                    <p>No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default ExerciseDetailPage;
