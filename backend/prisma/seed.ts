import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../src/common/user-roles';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);
  const userPassword = await bcrypt.hash('user', 10);

  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      passwordHash: adminPassword,
      role: UserRoles.Admin,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      email: 'user@mail.com',
      passwordHash: userPassword,
      role: UserRoles.User,
    },
  });

  const sampleTrains = [
    {
      trainNumber: '101A',
      direction: 'Northbound',
      station: 'Central Station',
      departureTime: new Date(new Date().setHours(9, 0, 0, 0)),
      arrivalTime: new Date(new Date().setHours(11, 0, 0, 0)),
    },
    {
      trainNumber: '207C',
      direction: 'Southbound',
      station: 'East Station',
      departureTime: new Date(new Date().setHours(13, 30, 0, 0)),
      arrivalTime: new Date(new Date().setHours(15, 15, 0, 0)),
    },
    {
      trainNumber: '302B',
      direction: 'Northbound',
      station: 'Central Station',
      departureTime: new Date(new Date().setHours(17, 0, 0, 0)),
      arrivalTime: new Date(new Date().setHours(18, 45, 0, 0)),
    },
  ];

  for (const train of sampleTrains) {
    await prisma.train.upsert({
      where: { trainNumber: train.trainNumber },
      update: {},
      create: train,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
