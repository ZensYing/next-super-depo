import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import BannerForm from "@/components/pages/admin/BannerForm";
import { getBannerById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const banner = await getBannerById(id);

    if (!banner) {
        notFound();
    }

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <BannerForm initialData={banner} />
            </div>
        </ProtectedRoute>
    );
}
