
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.tblUser.findMany({
            include: {
                role: true,
                vendor: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("GET users error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
