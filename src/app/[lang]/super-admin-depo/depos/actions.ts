"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { env } from "@/config/env";

const API_BASE = env.NEXT_PUBLIC_API_URL;

async function getHeaders() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export async function getVendors() {
    const headers = await getHeaders();
    try {
        const response = await fetch(`${API_BASE}/vendors`, {
            headers,
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("fetch vendors error:", error);
        return [];
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
