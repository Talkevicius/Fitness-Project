import React, { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import CommentCard from "../../components/CommentCard/CommentCard";
import styles from "./ComentsPage.module.css"
import {getUser, getUsernameById, isAdmin} from "../../context/auth.ts"

interface Comment {
    id: number;
    content: string;
    exerciseId: number;
    userId: number;
    user?: { id: number; username: string };
    username?: string;   // ← add this
}

interface Exercise {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    category?: any;
    comments: Comment[];
}

const API_URL = import.meta.env.VITE_API_URL;


const CommentsPage: FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (!exerciseId) return;

        axios.get(`${API_URL}/api/exercises/${exerciseId}`)
            .then(res => setExercise(res.data))
            .catch(err => console.error(err));
    }, [exerciseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exerciseId) return;

        // Only allow logged-in user or admin to post
        const user = getUser();
        if (!user && !isAdmin()) {
            alert("You must be logged in to post a comment.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${API_URL}/api/comments`,
                { exerciseId: Number(exerciseId), content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Fetch username for the new comment userId
            const username = await getUsernameById(res.data.userId);

            if (exercise) {
                setExercise({
                    ...exercise,
                    comments: [...exercise.comments, { ...res.data, username }],
                });
            }

            setNewComment("");
        } catch (err) {
            console.error(err);
            alert("Failed to post comment");
        }
    };




    useEffect(() => {
        const load = async () => {
            if (!exerciseId) return;

            const res = await axios.get(`${API_URL}/api/exercises/${exerciseId}`);
            const exerciseData = res.data;

            // Fetch usernames for each comment
            const commentsWithUsernames = await Promise.all(
                exerciseData.comments.map(async (c: Comment) => ({
                    ...c,
                    username: await getUsernameById(c.userId)
                }))
            );

            setExercise({
                ...exerciseData,
                comments: commentsWithUsernames
            });
        };

        load();
    }, [exerciseId]);

    const [authorName, setAuthorName] = useState<string>("Unknown");
    useEffect(() => {
        const load = async () => {
            if (!exerciseId) return;

            try {
                // 1️⃣ Fetch exercise
                const res = await axios.get(`${API_URL}/api/exercises/${exerciseId}`);
                const exerciseData = res.data;

                // 2️⃣ Fetch author name
                const name = await getUsernameById(exerciseData.userId ?? 0);
                setAuthorName(name);

                // 3️⃣ Fetch usernames for each comment
                const commentsWithUsernames = await Promise.all(
                    exerciseData.comments.map(async (c: Comment) => ({
                        ...c,
                        username: await getUsernameById(c.userId)
                    }))
                );

                // 4️⃣ Update state
                setExercise({
                    ...exerciseData,
                    comments: commentsWithUsernames
                });
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, [exerciseId]);


    const deleteComment = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (exercise) {
                setExercise({
                    ...exercise,
                    comments: exercise.comments.filter(c => c.id !== id),
                });
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const editComment = async (id: number, newContent: string) => {
        if (!exercise) return; // sanity check

        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${API_URL}/api/comments/${id}`,
                {
                    id,                    // must include the comment ID
                    content: newContent,   // the updated content
                    exerciseId: exercise.id // include exerciseId to satisfy validation
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state with new content
            setExercise({
                ...exercise,
                comments: exercise.comments.map(c =>
                    c.id === id ? { ...c, content: res.data.content } : c
                ),
            });
        } catch (err) {
            console.error(err);
            alert("Failed to edit comment");
        }
    };




    return (
        <div className={`${styles.pageContainer} ${styles.fadeDown}`}>
           <div className={styles.themeContainer}>
               <h1>Comments</h1>
               {/* ExerciseCard on top */}
               {exercise && (
                   <div className={styles.centeringContainer}>
                       <ExerciseCard
                           id={exercise.id}
                           name={exercise.name}
                           description={exercise.description}
                           categoryId={exercise.categoryId}
                           muscleGroup={exercise.category?.muscleGroup}
                           authorId={exercise.category?.authorId ?? 0} // fallback
                           authorName={authorName}
                           onDelete={() => {}}
                           onEdit={() => {}}
                           hideActions={true} // hide edit/delete
                       />
                   </div>

               )}

               {/* Input bar */}
               <form onSubmit={handleSubmit}>
                   <input
                       type="text"
                       placeholder="Write a comment..."
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       required
                   />
                   <button type="submit">Post</button>
               </form>

               {/* List of comments */}
               <div>
                   {exercise?.comments.map((comment) => (
                       <CommentCard
                           key={comment.id}
                           id={comment.id}
                           username={comment.username ?? "Unknown"}
                           content={comment.content}
                           userId={comment.userId}
                           onDelete={deleteComment}
                           onEdit={editComment}
                       />
                   ))}
               </div>

           </div>
       </div>
        
    );
};

export default CommentsPage;
