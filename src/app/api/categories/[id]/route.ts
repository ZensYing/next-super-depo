import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    try {
        const category = await prisma.tblCategories.update({
            where: { id },
            data: {
                nameKh: body.nameKh,
                nameEn: body.nameEn,
                nameKo: body.nameKo,
                slug: body.slug,
                image: body.image,
                userUpdated: { connect: { id: session.user.id } },
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    try {
        await prisma.tblCategories.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
