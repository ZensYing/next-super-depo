import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const slug = body.slug || body.nameEn?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `sub-${Date.now()}`;

    try {
        const subCategory = await prisma.tblSubCategories.create({
            data: {
                nameKh: body.nameKh,
                nameEn: body.nameEn,
                nameKo: body.nameKo,
                slug: slug,
                category: { connect: { id: body.categoryId } },
                userCreated: { connect: { id: session.user.id } },
                userUpdated: { connect: { id: session.user.id } },
            }
        });
        return NextResponse.json(subCategory);
    } catch (error) {
        console.error("Create subcategory error:", error);
        return NextResponse.json({ error: "Failed to create sub-category" }, { status: 500 });
    }
}
