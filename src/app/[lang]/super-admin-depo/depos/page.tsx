import VendorManagement from "@/components/pages/admin/VendorManagement";
import { getVendors } from "./actions";
import { getCategories } from "../categories/actions";

export default async function VendorManagementPage() {
    const [initialVendors, initialCategories] = await Promise.all([
        getVendors(),
        getCategories()
    ]);

    return <VendorManagement initialVendors={initialVendors} initialCategories={initialCategories} />;
}
