
import { PrismaClient, RoleEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'thakhmer855@gmail.com';

    // 1. Ensure Superadmin Role exists
    const superAdminRole = await prisma.tblRole.upsert({
        where: { id: 'superadmin-role-id' }, // You might want a dynamic lookup if ID isn't fixed, but let's try to find by enum first
        update: {},
        create: {
            id: 'superadmin-role-id', // Optional: fixed ID for consistency or let UUID gen
            title: RoleEnum.superadmin
        }
    });

    // Better way: Find by enum if not using fixed IDs
    const role = await prisma.tblRole.findFirst({
        where: { title: RoleEnum.superadmin }
    });

    if (!role) {
        console.log("Creating superadmin role...");
        await prisma.tblRole.create({
            data: { title: RoleEnum.superadmin }
        });
    }

    const finalRole = await prisma.tblRole.findFirst({ where: { title: RoleEnum.superadmin } });
    if (!finalRole) throw new Error("Failed to find/create superadmin role");

    // 2. Update User
    console.log(`Updating user ${email} to superadmin...`);
    const user = await prisma.tblUser.findUnique({
        where: { email }
    });

    if (!user) {
        console.error(`User with email ${email} not found! Please register first.`);
        return;
    }

    await prisma.tblUser.update({
        where: { email },
        data: {
            roleId: finalRole.id
        }
    });

    console.log("Successfully updated user role to superadmin!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
