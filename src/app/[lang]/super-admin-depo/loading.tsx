import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-10 w-64" />
                    <div className="ml-auto flex gap-2">
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
