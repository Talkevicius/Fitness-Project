// src/routes/exercisesLoader.ts
import axios from "axios";

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
export default async function exercisesLoader() {
    const res = await axios.get("http://localhost:5214/api/exercises", {
        params: {
            pageNumber: 1,
            pageSize: 50, // larger than total exercises
        },
    });
    return res.data.items;
}
