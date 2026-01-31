import { notFound } from "next/navigation";
import { getCategoryById, getProductsByCategory } from "@/app/[lang]/actions";
import CategoryDetail from "@/components/pages/CategoryDetail";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // slug could be either an ID or a slug
    const category = await getCategoryById(slug);

    if (!category) {
        notFound();
    }

    const products = await getProductsByCategory(category.id);

    return <CategoryDetail category={category} products={products} />;
}
