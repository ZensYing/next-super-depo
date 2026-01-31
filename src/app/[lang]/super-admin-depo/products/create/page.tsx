import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProductForm from "@/components/pages/admin/ProductForm";
import { getProductFormMetadata } from "../actions";

export default async function CreateProductPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const session = await auth();
    const metaData = await getProductFormMetadata();

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <ProductForm
                    metaData={metaData}
                    userRole={(session?.user as any)?.role}
                    userVendorId={(session?.user as any)?.vendorId}
                />
            </div>
        </ProtectedRoute>
    );
}
