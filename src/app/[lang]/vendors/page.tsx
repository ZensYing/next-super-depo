import Vendors from "@/components/pages/Vendors";
import { getVendors } from "../super-admin-depo/depos/actions";

export default async function Page() {
    const vendors = await getVendors();
    return <Vendors initialVendors={vendors} />;
}
