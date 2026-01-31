"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

async function checkSuperAdmin() {
    const session = await auth();
    if (!session || (session.user as any).role !== 'superadmin') {
        throw new Error("Unauthorized: Only superadmin can manage system settings");
    }
    return session;
}

function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

// --- Type Food (Units) ---

export async function getTypeFoods() {
    try {
        const data = await prisma.tblTypeFood.findMany({
            orderBy: { sort: 'asc' }
        });
        return serialize(data);
    } catch (error) {
        console.error("fetch typeFoods error:", error);
        return [];
    }
}

export async function submitTypeFood(data: any, id?: string) {
    try {
        const session = await checkSuperAdmin();

        if (id) {
            await prisma.tblTypeFood.update({
                where: { id },
                data: {
                    title: data.title,
                    status: data.status,
                    sort: parseInt(data.sort) || 0,
                    userUpdated: { connect: { id: session.user.id } }
                }
            });
        } else {
            await prisma.tblTypeFood.create({
                data: {
                    title: data.title,
                    status: data.status || 'active',
                    sort: parseInt(data.sort) || 0,
                    userCreated: { connect: { id: session.user.id } },
                    userUpdated: { connect: { id: session.user.id } }
                }
            });
        }

        revalidatePath('/[lang]/super-admin-depo/settings', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true };
    } catch (error: any) {
        return { ok: false, error: error.message };
    }
}

export async function deleteTypeFood(id: string) {
    try {
        await checkSuperAdmin();
        await prisma.tblTypeFood.delete({ where: { id } });
        revalidatePath('/[lang]/super-admin-depo/settings', 'page');
        return { ok: true };
    } catch (error: any) {
        return { ok: false, error: error.message };
    }
}

// --- Currencies ---

export async function getCurrencies() {
    try {
        const data = await prisma.tblCurrency.findMany({
            orderBy: { title: 'asc' }
        });
        return serialize(data);
    } catch (error) {
        console.error("fetch currencies error:", error);
        return [];
    }
}

export async function submitCurrency(data: any, id?: string) {
    try {
        await checkSuperAdmin();

        if (id) {
            await prisma.tblCurrency.update({
                where: { id },
                data: {
                    title: data.title,
                    symbol: data.symbol,
                    exchangeRateToUsd: data.exchangeRateToUsd,
                    status: data.status
                }
            });
        } else {
            await prisma.tblCurrency.create({
                data: {
                    title: data.title,
                    symbol: data.symbol,
                    exchangeRateToUsd: data.exchangeRateToUsd || 1,
                    status: data.status || 'active'
                }
            });
        }

        revalidatePath('/[lang]/super-admin-depo/settings', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true };
    } catch (error: any) {
        return { ok: false, error: error.message };
    }
}

export async function deleteCurrency(id: string) {
    try {
        await checkSuperAdmin();
        await prisma.tblCurrency.delete({ where: { id } });
        revalidatePath('/[lang]/super-admin-depo/settings', 'page');
        return { ok: true };
    } catch (error: any) {
        return { ok: false, error: error.message };
    }
}
