import { PrismaClient, UserRole, KYCStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create OWNER user with KYC
  const owner = await prisma.user.upsert({
    where: { phone: "0712345678" },
    update: {},
    create: {
      phone: "0712345678",
      role: UserRole.OWNER,
      kyc: {
        create: {
          fullName: "Test Owner",
          nationalId: "12345678",
          selfieUrl: "https://example.com/selfie.png",
          address: "Nairobi",
          status: KYCStatus.APPROVED
        }
      }
    }
  });

  // Create RENTER user with KYC
  const renter = await prisma.user.upsert({
    where: { phone: "0798765432" },
    update: {},
    create: {
      phone: "0798765432",
      role: UserRole.RENTER,
      kyc: {
        create: {
          fullName: "Test Renter",
          nationalId: "87654321",
          selfieUrl: "https://example.com/selfie2.png",
          address: "Nairobi",
          status: KYCStatus.APPROVED
        }
      }
    }
  });

  // Create Vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      ownerId: owner.id,
      title: "Toyota Axio 2012",
      category: "CAR",
      dailyPrice: 3000,
      monthlyPrice: 75000,
      location: "Nairobi",
      images: ["https://example.com/car.png"]
    }
  });

  console.log("Seed completed:", { owner, renter, vehicle });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
