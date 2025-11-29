import axios from "axios";

export default async function CategoriesLoader() {
    const response = await axios.get("http://localhost:5214/api/categories");
    return response.data.items; // This data is passed to CategoryPage via useLoaderData()
}

