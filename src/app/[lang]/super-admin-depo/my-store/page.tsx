import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ManageStoreForm from "@/components/pages/admin/ManageStoreForm";
import { getMyStore } from "./actions";

export default async function MyStorePage() {
    const session = await auth();
    const store = await getMyStore();

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="p-4 md:p-8 bg-muted/20 min-h-screen">
                <ManageStoreForm
                    initialData={store}
                    userId={(session?.user as any)?.id}
                />
            </div>
        </ProtectedRoute>
    );
}
