const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = '4bbdfa51-02ba-49cd-9765-e609c4c0f802';
    const product = await prisma.tblProduct.findUnique({
        where: { id }
    });
    console.log('Product:', product);

    if (!product) {
        const allProducts = await prisma.tblProduct.findMany({ take: 5 });
        console.log('Sample Products:', JSON.stringify(allProducts, null, 2));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
