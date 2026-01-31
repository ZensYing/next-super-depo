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
        const subCategory = await prisma.tblSubCategories.update({
            where: { id },
            data: {
                nameKh: body.nameKh,
                nameEn: body.nameEn,
                nameKo: body.nameKo,
                userUpdated: { connect: { id: session.user.id } },
            }
        });
        return NextResponse.json(subCategory);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update sub-category" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'vendor_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    try {
        await prisma.tblSubCategories.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete sub-category" }, { status: 500 });
    }
}
