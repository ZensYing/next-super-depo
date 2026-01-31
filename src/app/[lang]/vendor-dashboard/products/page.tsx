
import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProductManagement from "@/components/pages/admin/ProductManagement";
import { getProducts, getProductFormMetadata } from "../../super-admin-depo/products/actions";

export default async function VendorProductsPage() {
    const session = await auth();
    const vendorId = (session?.user as any)?.vendorId;

    const products = await getProducts(vendorId);
    const metaData = await getProductFormMetadata();

    return (
        <ProtectedRoute allowedRoles={['vendor', 'vendor_admin']}>
            <ProductManagement
                initialProducts={products}
                metaData={metaData}
                isVendorView={true}
                currentVendorId={vendorId}
            />
        </ProtectedRoute>
    );
}
