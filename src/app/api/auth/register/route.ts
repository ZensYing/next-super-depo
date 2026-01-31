
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Schema for registration validation
const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = registerSchema.parse(body);

        const { email, password, fullName, phone } = validatedData;

        // Check if user already exists
        const existingUser = await prisma.tblUser.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: phone || undefined }
                ]
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email or phone already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get default role (customer)
        // You might want to ensure 'customer' role exists in your seeding script
        const customerRole = await prisma.tblRole.findFirst({
            where: { title: 'customer' }
        });

        // Fallback if no role found (should be seeded)
        let roleId = customerRole?.id;

        if (!roleId) {
            // Create role if it doesn't exist (safety net)
            const newRole = await prisma.tblRole.create({
                data: { title: 'customer' }
            });
            roleId = newRole.id;
        }

        // Create user
        const newUser = await prisma.tblUser.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                phone,
                roleId: roleId!,
                status: "active",
            },
        });

        // Return success (excluding password)
        const { passwordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Validation Error", errors: error.errors },
                { status: 400 }
            );
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
