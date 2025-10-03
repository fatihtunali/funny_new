const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'admin@funnytourism.com',
        password: hashedPassword
      }
    });

    console.log('\n✓ Admin created successfully!');
    console.log('Email: admin@funnytourism.com');
    console.log('Password: 123456');
    console.log('\nLogin at: http://localhost:3000/admin/login\n');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('\nAdmin already exists!');
      console.log('Email: admin@funnytourism.com');
      console.log('Password: 123456');
      console.log('\nLogin at: http://localhost:3000/admin/login\n');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
