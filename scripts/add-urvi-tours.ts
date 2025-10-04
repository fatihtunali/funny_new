import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Creating Urvi Tours Agent ===\n');

  const agentData = {
    email: 'urvi@urvitours.com',
    password: 'urvi123456', // Change this password after first login
    companyName: 'Urvi Tours',
    contactName: 'Urvi Tours',
    phone: '+919898989898',
    country: 'India',
    address: 'Mumbai, India',
    commissionRate: 10.0,
    status: 'ACTIVE' as const,
  };

  // Check if agent already exists
  const existingAgent = await prisma.agent.findUnique({
    where: { email: agentData.email },
  });

  if (existingAgent) {
    console.error(`\n❌ Agent with email ${agentData.email} already exists.`);
    console.log('\nExisting Agent Details:');
    console.log(`  ID: ${existingAgent.id}`);
    console.log(`  Email: ${existingAgent.email}`);
    console.log(`  Company: ${existingAgent.companyName}`);
    console.log(`  Status: ${existingAgent.status}`);
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(agentData.password, 10);

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      email: agentData.email,
      password: hashedPassword,
      companyName: agentData.companyName,
      contactName: agentData.contactName,
      phone: agentData.phone,
      country: agentData.country,
      address: agentData.address,
      commissionRate: agentData.commissionRate,
      status: agentData.status,
      approvedAt: new Date(), // Pre-approved
    },
  });

  console.log('✅ Urvi Tours agent created successfully!\n');
  console.log('Agent Details:');
  console.log(`  ID: ${agent.id}`);
  console.log(`  Email: ${agent.email}`);
  console.log(`  Password: ${agentData.password} (CHANGE THIS AFTER FIRST LOGIN!)`);
  console.log(`  Company: ${agent.companyName}`);
  console.log(`  Contact: ${agent.contactName}`);
  console.log(`  Phone: ${agent.phone}`);
  console.log(`  Country: ${agent.country}`);
  console.log(`  Address: ${agent.address}`);
  console.log(`  Status: ${agent.status}`);
  console.log(`  Commission Rate: ${agent.commissionRate}%`);
  console.log(`  Approved At: ${agent.approvedAt}`);
  console.log('\nLogin at: /agent/login');
  console.log(`  Email: ${agent.email}`);
  console.log(`  Password: ${agentData.password}\n`);
}

main()
  .catch((error) => {
    console.error('Error creating agent:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
