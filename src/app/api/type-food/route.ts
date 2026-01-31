import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.tblTypeFood.findMany({
        where: { status: 'active' },
        orderBy: { sort: 'asc' }
    });
    return NextResponse.json(data);
}
