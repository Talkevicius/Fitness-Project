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

export default async function exercisesByCategoryLoader({ params }: any) {
    const { categoryId } = params;

    const res = await axios.get(`${API_URL}/api/categories/${categoryId}`);
    const category = { id: res.data.id, muscleGroup: res.data.muscleGroup };

    // inject category into each exercise
    const exercisesWithCategory: Exercise[] = res.data.exercises.map((ex: any) => ({
        ...ex,
        category,
    }));

    return exercisesWithCategory;
}
