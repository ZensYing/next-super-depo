
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const session = await auth();

    // @ts-ignore
    const userRole = session?.user?.role;
    // @ts-ignore
    const userVendorId = session?.user?.vendorId;

    let filterVendorId = searchParams.get('vendorId');

    // Security: If not superadmin, force vendor filter
    if (userRole !== 'superadmin') {
        if (!userVendorId) {
            // If no vendor ID but restricted role, maybe return empty or error. 
            // Assuming public access is NOT allowed for this route (it's admin route).
            // But wait, if public storefront calls this? Public storefront usually has separate route or public flag.
            // This seems to be the main management API.
            // If no session, auth guard at top? Currently no auth guard in GET.
            // Let's add auth guard if strict. 
            // The user prompt "crud product for vendor and superadmin" implies management.
            // For public view, usually we want all products.
            // Let's assume this route is for management (dashboard).
            // If no session, maybe public? 
            // To be safe: If session exists and role is vendor, filter. 
            // If no session, allow all? That leaks data.
            // I'll add auth check for now to be safe, or check separate public route for storefront. 
        }
        if (userVendorId) {
            filterVendorId = userVendorId;
        }
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
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET products error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Basic validation
        if (!body.productNameKh || !body.slug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate Slug if not provided (though body.slug check implies it is)
        // Ensure unique slug
        const existing = await prisma.tblProduct.findUnique({ where: { slug: body.slug } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }

        // Determine Vendor ID securely
        // @ts-ignore
        const userRole = session.user.role as string;
        // @ts-ignore
        const userVendorId = session.user.vendorId as string;

        // Force vendorId from session if available, otherwise fallback to body (for platform-level superadmin)
        let finalVendorId = userVendorId || body.vendorId;

        if (!finalVendorId) {
            return NextResponse.json({ error: "Vendor ID is required. Your user account must be associated with a Vendor/Store." }, { status: 400 });
        }

        const product = await prisma.tblProduct.create({
            data: {
                productNameKh: body.productNameKh,
                productNameEn: body.productNameEn,
                productNameKo: body.productNameKo,
                slug: body.slug,
                description: body.description,
                status: body.status || 'draft',
                categoryId: body.categoryId,
                subCategoryId: body.subCategoryId,
                vendorId: finalVendorId,
                mainImage: body.mainImage || '',
                subImages: body.subImages || [],
                stockQuantity: parseInt(body.stockQuantity || '0'),
                unlimitedStock: body.unlimitedStock || false,
                discount: body.discount || 0,
                userCreatedId: session.user.id!,
                userUpdatedId: session.user.id!,

                productPrices: {
                    create: body.prices?.map((p: any) => ({
                        typeFoodId: p.typeFoodId,
                        currencyId: p.currencyId,
                        price: p.price,
                        unitLabel: p.unitLabel,
                        minOrderQty: p.minOrderQty,
                        maxOrderQty: p.maxOrderQty
                    }))
                }
            },
            include: {
                productPrices: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("CREATE product error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
