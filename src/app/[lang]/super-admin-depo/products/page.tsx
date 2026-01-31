import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProductManagement from "@/components/pages/admin/ProductManagement";
import { getProducts, getProductFormMetadata } from "./actions";

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const session = await auth();
    const vendorId = (session?.user as any)?.vendorId;

    const products = await getProducts();
    const metaData = await getProductFormMetadata();

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <ProductManagement
                initialProducts={products}
                metaData={metaData}
                isVendorView={false}
                currentVendorId={vendorId}
            />
        </ProtectedRoute>
    );
}
