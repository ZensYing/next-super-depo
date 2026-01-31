
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await prisma.tblProduct.findUnique({
            where: { id },
            include: {
                productPrices: true,
                category: true,
                subCategory: true
            }
        });
        if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        // Security Check
        // @ts-ignore
        const userRole = session.user.role;
        // @ts-ignore
        const userVendorId = session.user.vendorId;

        if (userRole !== 'superadmin') {
            const existing = await prisma.tblProduct.findUnique({ where: { id }, select: { vendorId: true } });
            if (!existing || existing.vendorId !== userVendorId) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Transaction to update product and replace prices if needed
        // For simplicity, we'll update fields and upsert prices if logic allows, 
        // but often wiping and recreating prices is safer for "edit" forms that send full state.
        // Here we'll do: delete all prices -> create new prices (easiest way to sync)

        const updateProduct = prisma.tblProduct.update({
            where: { id },
            data: {
                productNameKh: body.productNameKh,
                productNameEn: body.productNameEn,
                productNameKo: body.productNameKo,
                slug: body.slug,
                description: body.description,
                status: body.status,
                categoryId: body.categoryId,
                subCategoryId: body.subCategoryId,
                mainImage: body.mainImage,
                subImages: body.subImages,
                stockQuantity: parseInt(body.stockQuantity || '0'),
                unlimitedStock: body.unlimitedStock,
                discount: body.discount,
                userUpdatedId: session.user.id!,
                // Ensure vendorId cannot be changed by vendors
                ...(userRole === 'superadmin' && body.vendorId ? { vendorId: body.vendorId } : {})
            }
        });

        const deletePrices = prisma.tblProductPrice.deleteMany({
            where: { productId: id }
        });

        const createPrices = prisma.tblProductPrice.createMany({
            data: (body.prices || []).map((p: any) => ({
                productId: id,
                typeFoodId: p.typeFoodId,
                currencyId: p.currencyId,
                price: p.price,
                unitLabel: p.unitLabel,
                minOrderQty: p.minOrderQty,
                maxOrderQty: p.maxOrderQty
            }))
        });

        await prisma.$transaction([deletePrices, updateProduct, createPrices]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("UPDATE product error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Security Check
        // @ts-ignore
        const userRole = session.user.role;
        // @ts-ignore
        const userVendorId = session.user.vendorId;

        if (userRole !== 'superadmin') {
            const existing = await prisma.tblProduct.findUnique({ where: { id }, select: { vendorId: true } });
            if (!existing || existing.vendorId !== userVendorId) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Cascade delete handled by DB usually, or need to verify prisma schema relations
        // Prisma schema didn't show onDelete cascade explicitly in the snippet I saw, 
        // but let's assume manual cleanup or prisma cascade.
        // Actually Relation "productPrices" is TblProductPrice[], let's delete them first to be safe.

        await prisma.tblProductPrice.deleteMany({ where: { productId: id } });
        await prisma.tblProduct.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
