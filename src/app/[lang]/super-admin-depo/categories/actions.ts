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

export async function getCategories() {
    const headers = await getHeaders();
    try {
        const response = await fetch(`${API_BASE}/categories`, {
            headers,
            cache: 'no-store'
        });

        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("fetch categories error:", error);
        return [];
    }
}

export async function submitCategory(formData: any, id?: number) {
    const headers = await getHeaders();
    headers['Content-Type'] = 'application/json';
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${API_BASE}/categories/${id}` : `${API_BASE}/categories`;

    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
    });

    if (response.ok) revalidatePath('/[lang]/super-admin-depo/categories', 'page');
    return { ok: response.ok, data: await response.json() };
}

export async function deleteCategory(id: number) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers
    });
    if (response.ok) revalidatePath('/[lang]/super-admin-depo/categories', 'page');
    return response.ok;
}

export async function submitSubCategory(formData: any, id?: number) {
    const headers = await getHeaders();
    headers['Content-Type'] = 'application/json';
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${API_BASE}/categories/sub/${id}` : `${API_BASE}/categories/sub`;

    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
    });

    if (response.ok) revalidatePath('/[lang]/super-admin-depo/categories', 'page');
    return { ok: response.ok, data: await response.json() };
}

export async function deleteSubCategory(id: number) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE}/categories/sub/${id}`, {
        method: 'DELETE',
        headers
    });
    if (response.ok) revalidatePath('/[lang]/super-admin-depo/categories', 'page');
    return response.ok;
}

export async function seedCategories() {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE}/categories/seed`, {
        method: 'POST',
        headers
    });
    if (response.ok) revalidatePath('/[lang]/super-admin-depo/categories', 'page');
    return response.ok;
}
