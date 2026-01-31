"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Helper to serialize data
function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

export async function getBanners() {
    try {
        const banners = await prisma.tblBanner.findMany({
            orderBy: { sort: 'asc' },
            include: {
                userCreated: { select: { fullName: true } }
            }
        });
        return serialize(banners);
    } catch (error) {
        console.error("fetch banners error:", error);
        return [];
    }
}

export async function getBannerById(id: string) {
    try {
        const banner = await prisma.tblBanner.findUnique({
            where: { id }
        });
        return serialize(banner);
    } catch (error) {
        console.error("fetch banner error:", error);
        return null;
    }
}

export async function createBanner(data: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const banner = await prisma.tblBanner.create({
            data: {
                title: data.title,
                description: data.description,
                link: data.link,
                thumbnail: data.thumbnail,
                sort: parseInt(data.sort?.toString() || '0'),
                status: data.status || 'active',
                userCreatedId: session.user.id,
                userUpdatedId: session.user.id,
            }
        });

        revalidatePath('/[lang]/super-admin-depo/banners', 'page');
        revalidatePath('/[lang]');
        return { ok: true, data: serialize(banner) };
    } catch (error: any) {
        console.error("create banner error:", error);
        return { ok: false, error: error.message };
    }
}

export async function updateBanner(id: string, data: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await prisma.tblBanner.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                link: data.link,
                thumbnail: data.thumbnail,
                sort: parseInt(data.sort?.toString() || '0'),
                status: data.status,
                userUpdatedId: session.user.id,
            }
        });

        revalidatePath('/[lang]/super-admin-depo/banners', 'page');
        revalidatePath('/[lang]');
        return { ok: true };
    } catch (error: any) {
        console.error("update banner error:", error);
        return { ok: false, error: error.message };
    }
}

export async function deleteBanner(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await prisma.tblBanner.delete({ where: { id } });
        revalidatePath('/[lang]/super-admin-depo/banners', 'page');
        revalidatePath('/[lang]');
        return true;
    } catch (error) {
        console.error("delete banner error:", error);
        return false;
    }
}
