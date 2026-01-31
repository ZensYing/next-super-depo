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

export async function getUsers() {
    const headers = await getHeaders();
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers,
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("fetch users error:", error);
        return [];
    }
}
