import { getHomePageData } from "./actions";
import Index from "@/components/pages/Index";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
    const homeData = await getHomePageData();
    return <Index data={homeData} />;
}
