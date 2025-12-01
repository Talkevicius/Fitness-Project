import axios from "axios";

export default async function exerciseDetailLoader({ params }: { params: { exerciseId: string } }) {
    const { exerciseId } = params;

    try {
        const [exerciseRes, commentsRes] = await Promise.all([
            axios.get(`http://localhost:5214/api/exercises/${exerciseId}`),
            axios.get(`http://localhost:5214/api/exercises/${exerciseId}/comments`),
        ]);

        return {
            exercise: exerciseRes.data,
            comments: commentsRes.data,
        };
    } catch (err) {
        throw new Response("Failed to load exercise or comments", { status: 500 });
    }
}
