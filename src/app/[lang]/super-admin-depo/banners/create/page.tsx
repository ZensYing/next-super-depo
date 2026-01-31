import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import BannerForm from "@/components/pages/admin/BannerForm";

export default function CreateBannerPage() {
    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <BannerForm />
            </div>
        </ProtectedRoute>
    );
}
