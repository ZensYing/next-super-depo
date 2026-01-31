"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { env } from "@/config/env";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const API_BASE = env.NEXT_PUBLIC_API_URL;

async function checkAuth() {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    return session;
}

// Function to safely serialize Prisma data (converting Decimals, Dates, etc. to plain types)
function serialize(data: any) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

export async function getProducts(vendorId?: string) {
    const session = await auth();

    // @ts-ignore
    const userRole = session?.user?.role;
    // @ts-ignore
    const userVendorId = session?.user?.vendorId;

    let filterVendorId = vendorId;

    if (userRole !== 'superadmin' && userVendorId) {
        filterVendorId = userVendorId;
    }

    try {
        const products = await prisma.tblProduct.findMany({
            where: filterVendorId ? { vendorId: filterVendorId } : undefined,
            include: {
                category: true,
                subCategory: true,
                vendor: true,
                productPrices: {
                    include: {
                        currency: true,
                        typeFood: true
                    }
                }
            },
            orderBy: { dateCreated: 'desc' }
        });
        return serialize(products);
    } catch (error) {
        console.error("fetch products error:", error);
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.tblProduct.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                vendor: {
                    include: {
                        _count: {
                            select: { products: true }
                        }
                    }
                },
                productPrices: {
                    include: {
                        currency: true,
                        typeFood: true
                    }
                }
            }
        });

        if (!product) return null;

        // Get related products from the same vendor
        const relatedProducts = await prisma.tblProduct.findMany({
            where: {
                vendorId: product.vendorId,
                id: { not: product.id },
                status: 'published'
            },
            take: 4,
            include: {
                productPrices: {
                    include: { currency: true }
                }
            }
        });

        return serialize({ ...product, relatedProducts });
    } catch (error) {
        console.error("fetch product error:", error);
        return null;
    }
}

export async function getProductFormMetadata() {
    try {
        const session = await auth();
        const userId = (session?.user as any)?.id;

        // Get user's vendorId from database (in case session is stale)
        let userVendorId = (session?.user as any)?.vendorId;
        if (!userVendorId && userId) {
            const user = await prisma.tblUser.findUnique({
                where: { id: userId },
                select: { vendorId: true }
            });
            userVendorId = user?.vendorId;
        }

        const [categories, vendors, typeFoods, currencies] = await Promise.all([
            prisma.tblCategories.findMany({ include: { subCategories: true } }),
            // Only fetch the user's own store(s)
            userVendorId
                ? prisma.tblVendor.findMany({
                    where: { id: userVendorId },
                    select: { id: true, vendorName: true }
                })
                : [],
            prisma.tblTypeFood.findMany({ where: { status: 'active' } }),
            prisma.tblCurrency.findMany({ where: { status: 'active' } })
        ]);

        return {
            categories: serialize(categories),
            vendors: serialize(vendors),
            typeFoods: serialize(typeFoods),
            currencies: serialize(currencies)
        };
    } catch (error) {
        console.error("Meta fetch error:", error);
        return { categories: [], vendors: [], typeFoods: [], currencies: [] };
    }
}

export async function createProduct(data: any) {
    try {
        const session = await checkAuth();

        let vendorId = data.vendorId || (session.user as any).vendorId;

        // Fallback for superadmin who hasn't assigned themselves to a specific vendor
        if (!vendorId && (session.user as any).role === 'superadmin') {
            const firstVendor = await prisma.tblVendor.findFirst({ select: { id: true } });
            if (firstVendor) {
                vendorId = firstVendor.id;
            }
        }

        if (!vendorId) {
            return { ok: false, error: "No Depo associated with your account. Please create at least one Depo in 'Depos' section first or assign your account to a Depo." };
        }

        const product = await prisma.tblProduct.create({
            data: {
                productNameKh: data.productNameKh,
                productNameEn: data.productNameEn,
                productNameKo: data.productNameKo,
                slug: data.slug,
                description: data.description,
                status: data.status,
                categoryId: data.categoryId,
                subCategoryId: data.subCategoryId,
                vendorId: vendorId,
                mainImage: data.mainImage,
                subImages: data.subImages,
                stockQuantity: parseInt(data.stockQuantity?.toString() || '0'),
                unlimitedStock: data.unlimitedStock,
                discount: parseFloat(data.discount?.toString() || '0'),
                userCreatedId: session.user.id!,
                userUpdatedId: session.user.id!,
                productPrices: {
                    create: data.prices?.map((p: any) => ({
                        typeFoodId: p.typeFoodId,
                        currencyId: p.currencyId,
                        price: parseFloat(p.price?.toString() || '0'),
                        unitLabel: p.unitLabel,
                        minOrderQty: parseInt(p.minOrderQty?.toString() || '1'),
                        maxOrderQty: parseInt(p.maxOrderQty?.toString() || '999')
                    }))
                }
            }
        });

        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true, data: serialize(product) };
    } catch (error: any) {
        console.error("CREATE product error:", error);
        return { ok: false, error: error.message };
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        const session = await checkAuth();

        // 1. Delete existing prices
        await prisma.tblProductPrice.deleteMany({ where: { productId: id } });

        let vendorId = data.vendorId || (session.user as any).vendorId;

        // Fallback for superadmin
        if (!vendorId && (session.user as any).role === 'superadmin') {
            const firstVendor = await prisma.tblVendor.findFirst({ select: { id: true } });
            if (firstVendor) {
                vendorId = firstVendor.id;
            }
        }

        if (!vendorId) {
            return { ok: false, error: "No Depo associated with your account. Please create at least one Depo in 'Depos' section first." };
        }

        // 2. Update product and create new prices
        await prisma.tblProduct.update({
            where: { id },
            data: {
                productNameKh: data.productNameKh,
                productNameEn: data.productNameEn,
                productNameKo: data.productNameKo,
                slug: data.slug,
                description: data.description,
                status: data.status,
                categoryId: data.categoryId,
                subCategoryId: data.subCategoryId,
                vendorId: vendorId,
                mainImage: data.mainImage,
                subImages: data.subImages,
                stockQuantity: parseInt(data.stockQuantity?.toString() || '0'),
                unlimitedStock: data.unlimitedStock,
                discount: parseFloat(data.discount?.toString() || '0'),
                userUpdatedId: session.user.id!,
                productPrices: {
                    create: data.prices?.map((p: any) => ({
                        typeFoodId: p.typeFoodId,
                        currencyId: p.currencyId,
                        price: parseFloat(p.price?.toString() || '0'),
                        unitLabel: p.unitLabel,
                        minOrderQty: parseInt(p.minOrderQty?.toString() || '1'),
                        maxOrderQty: parseInt(p.maxOrderQty?.toString() || '999')
                    }))
                }
            }
        });

        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return { ok: true };
    } catch (error: any) {
        console.error("UPDATE product error:", error);
        return { ok: false, error: error.message };
    }
}

export async function deleteProduct(id: string) {
    try {
        await checkAuth();
        await prisma.tblProduct.delete({ where: { id } });
        revalidatePath('/[lang]/super-admin-depo/products', 'page');
        return true;
    } catch (error) {
        console.error("DELETE product error:", error);
        return false;
    }
}
