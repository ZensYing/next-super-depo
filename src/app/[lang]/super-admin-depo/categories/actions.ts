"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAuth() {
    const session = await auth();
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getCategories() {
    try {
        const categories = await prisma.tblCategories.findMany({
            orderBy: { sort: 'asc' },
            include: { subCategories: true }
        });
        return categories;
    } catch (error) {
        console.error("fetch categories error:", error);
        return [];
    }
}

export async function submitCategory(formData: any, id?: string) {
    try {
        const session = await checkAuth();

        let category;
        if (id) {
            category = await prisma.tblCategories.update({
                where: { id },
                data: {
                    nameKh: formData.nameKh,
                    nameEn: formData.nameEn,
                    nameKo: formData.nameKo,
                    slug: formData.slug,
                    image: formData.image,
                    userUpdated: { connect: { id: session.user.id } },
                }
            });
        } else {
            category = await prisma.tblCategories.create({
                data: {
                    nameKh: formData.nameKh,
                    nameEn: formData.nameEn,
                    nameKo: formData.nameKo,
                    slug: formData.slug,
                    image: formData.image,
                    userCreated: { connect: { id: session.user.id } },
                    userUpdated: { connect: { id: session.user.id } },
                }
            });
        }

        revalidatePath('/[lang]/super-admin-depo/categories', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true, data: category };
    } catch (error: any) {
        console.error("submitCategory error:", error);
        return { ok: false, data: { error: error.message || "Failed to submit category" } };
    }
}

export async function deleteCategory(id: string) {
    try {
        await checkAuth();
        await prisma.tblCategories.delete({
            where: { id }
        });
        revalidatePath('/[lang]/super-admin-depo/categories', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return true;
    } catch (error) {
        console.error("deleteCategory error:", error);
        return false;
    }
}

export async function submitSubCategory(formData: any, id?: string) {
    try {
        const session = await checkAuth();

        let subCategory;
        if (id) {
            subCategory = await prisma.tblSubCategories.update({
                where: { id },
                data: {
                    nameKh: formData.nameKh,
                    nameEn: formData.nameEn,
                    nameKo: formData.nameKo,
                    slug: formData.slug,
                    image: formData.image,
                    userUpdated: { connect: { id: session.user.id } },
                }
            });
        } else {
            const slug = formData.slug || formData.nameEn?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `sub-${Date.now()}`;
            subCategory = await prisma.tblSubCategories.create({
                data: {
                    nameKh: formData.nameKh,
                    nameEn: formData.nameEn,
                    nameKo: formData.nameKo,
                    slug: slug,
                    image: formData.image,
                    category: { connect: { id: formData.categoryId } },
                    userCreated: { connect: { id: session.user.id } },
                    userUpdated: { connect: { id: session.user.id } },
                }
            });
        }

        revalidatePath('/[lang]/super-admin-depo/categories', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true, data: subCategory };
    } catch (error: any) {
        console.error("submitSubCategory error:", error);
        return { ok: false, data: { error: error.message || "Failed to submit sub-category" } };
    }
}

export async function deleteSubCategory(id: string) {
    try {
        await checkAuth();
        await prisma.tblSubCategories.delete({
            where: { id }
        });
        revalidatePath('/[lang]/super-admin-depo/categories', 'page');
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return true;
    } catch (error) {
        console.error("deleteSubCategory error:", error);
        return false;
    }
}

export async function seedCategories() {
    try {
        const session = await checkAuth();
        // Simple seed logic or just return false if not implemented
        // If there's a specific seeding logic it should be here
        return false;
    } catch (error) {
        console.error("seedCategories error:", error);
        return false;
    }
}
