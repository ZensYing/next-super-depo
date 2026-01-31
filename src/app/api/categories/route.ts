import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const categories = await prisma.tblCategories.findMany({
        orderBy: { sort: 'asc' },
        include: { subCategories: true }
    });
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await auth();
    // RBAC: superadmin or vendor_admin
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    try {
        const category = await prisma.tblCategories.create({
            data: {
                nameKh: body.nameKh,
                nameEn: body.nameEn,
                nameKo: body.nameKo,
                slug: body.slug,
                image: body.image,
                userCreated: { connect: { id: session.user.id } },
                userUpdated: { connect: { id: session.user.id } },
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
