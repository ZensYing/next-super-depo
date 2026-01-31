import CategoryManagement from "@/components/pages/admin/CategoryManagement";
import { getCategories } from "./actions";

export default async function CategoriesPage() {
    const initialCategories = await getCategories();

    return <CategoryManagement initialData={initialCategories} />;
}
