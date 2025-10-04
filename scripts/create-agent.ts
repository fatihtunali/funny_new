import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n=== Create Agent Account ===\n');

  const email = await question('Email: ');
  const password = await question('Password: ');
  const companyName = await question('Company Name: ');
  const contactName = await question('Contact Name: ');
  const phone = await question('Phone: ');
  const country = await question('Country (optional): ');
  const address = await question('Address (optional): ');
  const companyWebsite = await question('Company Website (optional): ');
  const commissionRateInput = await question('Commission Rate % (default: 10): ');
  const statusInput = await question('Status (PENDING/ACTIVE/SUSPENDED/REJECTED, default: ACTIVE): ');

  const commissionRate = commissionRateInput ? parseFloat(commissionRateInput) : 10.0;
  const status = statusInput || 'ACTIVE';

  // Validate status
  if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].includes(status)) {
    console.error('Invalid status. Must be PENDING, ACTIVE, SUSPENDED, or REJECTED');
    rl.close();
    process.exit(1);
  }

  // Check if agent already exists
  const existingAgent = await prisma.agent.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingAgent) {
    console.error(`\nError: Agent with email ${email} already exists.`);
    rl.close();
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName,
      contactName,
      phone,
      country: country || null,
      address: address || null,
      companyWebsite: companyWebsite || null,
      commissionRate,
      status: status as 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED',
      approvedAt: status === 'ACTIVE' ? new Date() : null,
    },
  });

  console.log('\n✅ Agent created successfully!\n');
  console.log('Agent Details:');
  console.log(`  ID: ${agent.id}`);
  console.log(`  Email: ${agent.email}`);
  console.log(`  Company: ${agent.companyName}`);
  console.log(`  Contact: ${agent.contactName}`);
  console.log(`  Phone: ${agent.phone}`);
  console.log(`  Status: ${agent.status}`);
  console.log(`  Commission Rate: ${agent.commissionRate}%`);
  console.log('\nAgent can now log in at: /agent/login\n');

  rl.close();
}

main()
  .catch((error) => {
    console.error('Error creating agent:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
