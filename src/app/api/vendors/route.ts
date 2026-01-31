
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const vendors = await prisma.tblVendor.findMany({
            include: {
                users: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(vendors);
    } catch (error) {
        console.error("GET vendors error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
