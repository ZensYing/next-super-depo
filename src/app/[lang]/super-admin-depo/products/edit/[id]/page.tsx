import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProductForm from "@/components/pages/admin/ProductForm";
import { getProductById, getProductFormMetadata } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditProductPage({
    params
}: {
    params: Promise<{ lang: string; id: string }>
}) {
    const session = await auth();
    const { id, lang } = await params;

    const [product, metaData] = await Promise.all([
        getProductById(id),
        getProductFormMetadata()
    ]);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h2 className="text-xl font-semibold">Product not found</h2>
                <p className="text-muted-foreground">The product with ID {id} does not exist.</p>
            </div>
        );
    }

    // Map productPrices to prices internal format for form
    const initialData = {
        ...product,
        prices: product.productPrices.map((p: any) => ({
            id: p.id,
            typeFoodId: p.typeFoodId,
            currencyId: p.currencyId,
            price: p.price,
            unitLabel: p.unitLabel || ""
        }))
    };

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <ProductForm
                    initialData={initialData}
                    metaData={metaData}
                    userRole={(session?.user as any)?.role}
                    userVendorId={(session?.user as any)?.vendorId}
                />
            </div>
        </ProtectedRoute>
    );
}
