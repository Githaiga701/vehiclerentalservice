import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create mock users
  const users = [
    {
      name: 'John Mwangi',
      email: 'john@example.com',
      phone: '+254712345678',
      role: 'RENTER',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Mary Wanjiku',
      email: 'mary@example.com',
      phone: '+254723456789',
      role: 'OWNER',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Peter Omondi',
      email: 'peter@example.com',
      phone: '+254734567890',
      role: 'OWNER',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Admin User',
      email: 'admin@vehiclerent.ke',
      phone: '+254790843300',
      role: 'ADMIN',
      password: await bcrypt.hash('admin123', 10),
    },
  ];

  console.log('👥 Creating users...');
  const createdUsers = [];
  
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { phone: userData.phone },
      update: userData,
      create: userData,
    });
    
    // Create trust score for each user
    await prisma.trustScore.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        score: userData.role === 'ADMIN' ? 100 : 50,
        kycCompleted: userData.role === 'ADMIN',
      },
    });

    // Create KYC for admin and one owner
    if (userData.role === 'ADMIN' || userData.phone === '+254723456789') {
      await prisma.kYC.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          fullName: userData.name,
          nationalId: userData.role === 'ADMIN' ? '12345678' : '87654321',
          address: 'Nairobi, Kenya',
          city: 'Nairobi',
          status: 'APPROVED',
        },
      });
    }

    createdUsers.push(user);
    console.log(`✅ Created user: ${userData.name} (${userData.role})`);
  }

  // Create mock vehicles for owners
  const owners = createdUsers.filter(u => u.role === 'OWNER' || u.role === 'ADMIN');
  
  const vehicles = [
    {
      title: 'Toyota Fortuner 2023',
      description: 'Perfect for family trips and off-road adventures. Spacious and comfortable.',
      category: 'SUV',
      dailyPrice: 8500,
      monthlyPrice: 200000,
      location: 'Nairobi',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=800'
      ]),
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      year: 2023,
      withDriver: false,
      isAvailable: true,
      ownerId: owners[0].id,
    },
    {
      title: 'Nissan X-Trail 2022',
      description: 'Reliable crossover SUV ideal for city and highway driving.',
      category: 'SUV',
      dailyPrice: 6500,
      monthlyPrice: 150000,
      location: 'Mombasa',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=800'
      ]),
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      year: 2022,
      withDriver: true,
      isAvailable: true,
      ownerId: owners[1] ? owners[1].id : owners[0].id,
    },
    {
      title: 'Subaru Forester 2021',
      description: 'Adventure-ready with excellent safety ratings and AWD capability.',
      category: 'SUV',
      dailyPrice: 5500,
      monthlyPrice: 130000,
      location: 'Nairobi',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1687048988997-ec57f83ea3bd?auto=format&fit=crop&q=80&w=800'
      ]),
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      year: 2021,
      withDriver: false,
      isAvailable: true,
      ownerId: owners[0].id,
    },
    {
      title: 'Toyota Prado 2024',
      description: 'Premium SUV with luxury features and exceptional off-road capability.',
      category: 'Luxury',
      dailyPrice: 12000,
      monthlyPrice: 300000,
      location: 'Nairobi',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=800'
      ]),
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      year: 2024,
      withDriver: true,
      isAvailable: true,
      ownerId: owners[1] ? owners[1].id : owners[0].id,
    },
  ];

  console.log('🚗 Creating vehicles...');
  for (const vehicleData of vehicles) {
    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
    });
    console.log(`✅ Created vehicle: ${vehicleData.title}`);
  }

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('👤 Regular User: +254712345678 (OTP: any 6 digits)');
  console.log('🏠 Owner: +254723456789 (OTP: any 6 digits)');
  console.log('👨‍💼 Admin: +254790843300 (OTP: any 6 digits)');
  console.log('\n💡 For OTP login, check the server console for the generated OTP code');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });