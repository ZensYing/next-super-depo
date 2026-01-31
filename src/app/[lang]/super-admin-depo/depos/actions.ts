"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { env } from "@/config/env";

const API_BASE = env.NEXT_PUBLIC_API_URL;

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAuth() {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'superadmin') {
        throw new Error("Unauthorized: SuperAdmin only");
    }
    return session;
}

async function getHeaders() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

export async function getVendorById(id: string) {
    try {
        const vendor = await prisma.tblVendor.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                },
                products: {
                    where: { status: 'published' },
                    include: {
                        productPrices: {
                            include: {
                                currency: true,
                                typeFood: true
                            }
                        }
                    }
                }
            }
        });
        return serialize(vendor);
    } catch (error) {
        console.error("fetch vendor by id error:", error);
        return null;
    }
}

export async function getVendors() {
    try {
        const vendors = await prisma.tblVendor.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return serialize(vendors);
    } catch (error) {
        console.error("fetch vendors error:", error);
        return [];
    }
}

export async function createDepo(data: any) {
    try {
        await checkAuth();

        const depo = await prisma.tblVendor.create({
            data: {
                vendorName: data.vendorName,
                vendorSlug: data.vendorSlug,
                logo: data.logo || null,
                description: data.description || null,
                contactPhone: data.contactPhone || null,
                address: data.address || null,
                status: 'active'
            }
        });

        revalidatePath('/[lang]/super-admin-depo/depos', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true, data: serialize(depo) };
    } catch (error: any) {
        console.error("CREATE depo error:", error);
        return { ok: false, error: error.message };
    }
}

export async function updateDepo(id: string, data: any) {
    try {
        await checkAuth();

        const depo = await prisma.tblVendor.update({
            where: { id },
            data: {
                vendorName: data.vendorName,
                vendorSlug: data.vendorSlug,
                logo: data.logo || null,
                description: data.description || null,
                contactPhone: data.contactPhone || null,
                address: data.address || null,
                status: data.status || 'active'
            }
        });

        revalidatePath('/[lang]/super-admin-depo/depos', 'page');
        return { ok: true, data: serialize(depo) };
    } catch (error: any) {
        console.error("UPDATE depo error:", error);
        return { ok: false, error: error.message };
    }
}

export async function deleteDepo(id: string) {
    try {
        await checkAuth();
        await prisma.tblVendor.delete({ where: { id } });
        revalidatePath('/[lang]/super-admin-depo/depos', 'page');
        return { ok: true };
    } catch (error: any) {
        console.error("DELETE depo error:", error);
        return { ok: false, error: error.message };
    }
}

export async function approveVendor(id: number) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE}/vendors/${id}/approve`, {
        method: 'PATCH',
        headers
    });
    if (response.ok) revalidatePath('/[lang]/super-admin-depo/depos', 'page');
    return response.ok;
}

export async function assignVendorCategory(vendorId: number, categoryId: number, subCategoryId?: number) {
    const headers = await getHeaders();
    headers['Content-Type'] = 'application/json';
    const response = await fetch(`${API_BASE}/vendors/${vendorId}/category`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ categoryId, subCategoryId })
    });
    if (response.ok) revalidatePath('/[lang]/super-admin-depo/depos', 'page');
    return response.ok;
}
