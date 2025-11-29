import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export default async function CategoriesLoader() {
    const response = await axios.get(`${API_URL}/api/categories`);
    return response.data.items; // This data is passed to CategoryPage via useLoaderData()
}

