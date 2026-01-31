import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import BannerManagement from "@/components/pages/admin/BannerManagement";
import { getBanners } from "./actions";

export default async function BannersPage() {
    const banners = await getBanners();

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <BannerManagement initialBanners={banners} />
            </div>
        </ProtectedRoute>
    );
}
