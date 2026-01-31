import VendorDetail from "@/components/pages/VendorDetail";
import { getVendorById } from "../../super-admin-depo/depos/actions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string; lang: string }> }) {
    const { id } = await params;
    const vendor = await getVendorById(id);

    if (!vendor) {
        notFound();
    }

    return <VendorDetail vendor={vendor} />;
}
