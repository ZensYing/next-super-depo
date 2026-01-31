import { notFound } from "next/navigation";
import { getProductById } from "@/app/[lang]/super-admin-depo/products/actions";
import ProductDetail from "@/components/pages/ProductDetail";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
