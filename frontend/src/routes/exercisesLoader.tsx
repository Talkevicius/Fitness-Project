import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

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
    const res = await axios.get(`${API_URL}/api/exercises`, {
        params: {
            pageNumber: 1,
            pageSize: 50, // load all
        },
    });
    return res.data.items;
}
