"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

async function checkAuth() {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'superadmin') {
        throw new Error("Unauthorized: SuperAdmin only");
    }
    return session;
}

export async function getMyStore() {
    try {
        const session = await checkAuth();
        const userId = (session.user as any).id;
        let vendorId = (session.user as any).vendorId;

        // If vendorId not in session, look it up from database
        if (!vendorId && userId) {
            const user = await prisma.tblUser.findUnique({
                where: { id: userId },
                select: { vendorId: true }
            });
            vendorId = user?.vendorId;
        }

        if (!vendorId) {
            return null;
        }

        const store = await prisma.tblVendor.findUnique({
            where: { id: vendorId },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return serialize(store);
    } catch (error) {
        console.error("fetch my store error:", error);
        return null;
    }
}

export async function updateMyStore(data: {
    vendorName?: string;
    vendorSlug?: string;
    logo?: string;
    banner?: string;
    description?: string;
    contactPhone?: string;
    address?: string;
    email?: string;
}) {
    try {
        const session = await checkAuth();
        const userId = (session.user as any).id;
        let vendorId = (session.user as any).vendorId;

        // If vendorId not in session, look it up from database
        if (!vendorId && userId) {
            const user = await prisma.tblUser.findUnique({
                where: { id: userId },
                select: { vendorId: true }
            });
            vendorId = user?.vendorId;
        }

        if (!vendorId) {
            return { ok: false, error: "No store associated with this account" };
        }

        const updatedStore = await prisma.tblVendor.update({
            where: { id: vendorId },
            data: {
                vendorName: data.vendorName,
                vendorSlug: data.vendorSlug,
                logo: data.logo,
                banner: data.banner,
                description: data.description,
                contactPhone: data.contactPhone,
                address: data.address,
                email: data.email
            }
        });

        revalidatePath('/[lang]/super-admin-depo/my-store', 'page');
        revalidatePath('/[lang]/vendors', 'page');

        return { ok: true, data: serialize(updatedStore) };
    } catch (error: any) {
        console.error("update my store error:", error);
        return { ok: false, error: error.message };
    }
}

export async function createMyStore(data: {
    vendorName: string;
    vendorSlug: string;
    logo?: string;
    banner?: string;
    description?: string;
    contactPhone?: string;
    address?: string;
    email?: string;
}) {
    try {
        const session = await checkAuth();
        const userId = (session.user as any).id;

        // Check if user already has a store
        const existingVendorId = (session.user as any).vendorId;
        if (existingVendorId) {
            return { ok: false, error: "You already have a store associated with your account" };
        }

        // Create new store
        const newStore = await prisma.tblVendor.create({
            data: {
                vendorName: data.vendorName,
                vendorSlug: data.vendorSlug,
                logo: data.logo || null,
                banner: data.banner || null,
                description: data.description || null,
                contactPhone: data.contactPhone || null,
                address: data.address || null,
                email: data.email || null,
                status: 'active'
            }
        });

        // Link store to user
        await prisma.tblUser.update({
            where: { id: userId },
            data: { vendorId: newStore.id }
        });

        revalidatePath('/[lang]/super-admin-depo/my-store', 'page');

        return { ok: true, data: serialize(newStore) };
    } catch (error: any) {
        console.error("create my store error:", error);
        return { ok: false, error: error.message };
    }
}
