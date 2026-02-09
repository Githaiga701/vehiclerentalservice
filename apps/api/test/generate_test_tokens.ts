import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();

async function main() {
  const secret = process.env.JWT_SECRET || 'test-secret';
  const jwt = new JwtService({ secret, signOptions: { expiresIn: '30d' } });

  const users = await prisma.user.findMany({ where: { OR: [{ role: 'RENTER' }, { role: 'OWNER' }, { role: 'ADMIN' }] } });

  const tokens: Record<string, string> = {};

  for (const u of users) {
    const payload = { sub: u.id, phone: u.phone, role: u.role };
    const token = jwt.sign(payload as any);
    tokens[u.role] = token;
    console.log(`${u.role} -> ${token}`);
  }

  console.log('\n# Export for CI (bash)');
  console.log(`export TEST_TOKEN_RENTER=${tokens['RENTER'] || ''}`);
  console.log(`export TEST_TOKEN_OWNER=${tokens['OWNER'] || ''}`);
  console.log(`export TEST_TOKEN_ADMIN=${tokens['ADMIN'] || ''}`);

  console.log('\n# Windows Powershell (set env)');
  console.log(`$env:TEST_TOKEN_RENTER = \"${tokens['RENTER'] || ''}\"`);
  console.log(`$env:TEST_TOKEN_OWNER = \"${tokens['OWNER'] || ''}\"`);
  console.log(`$env:TEST_TOKEN_ADMIN = \"${tokens['ADMIN'] || ''}\"`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error generating test tokens', e);
  process.exit(1);
});
