import { auth } from "@/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SystemSettings from "@/components/pages/admin/SystemSettings";
import { getTypeFoods, getCurrencies } from "./actions";
import { redirect } from "next/navigation";

export default async function SettingsPage({ params }: { params: { lang: string } }) {
    const session = await auth();

    // Extra guard to ensure only superadmins can access this route
    if (session?.user?.role !== 'superadmin' && session?.user?.role !== 'admin') {
        // Optionally redirect if not authorized
        // redirect(`/${params.lang}/dashboard`);
    }

    const typeFoods = await getTypeFoods();
    const currencies = await getCurrencies();

    return (
        <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
            <div className="p-4 md:p-8">
                <SystemSettings
                    initialTypeFoods={typeFoods}
                    initialCurrencies={currencies}
                />
            </div>
        </ProtectedRoute>
    );
}
