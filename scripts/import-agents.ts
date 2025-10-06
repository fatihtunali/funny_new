import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface AgentRow {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  phone: string;
  country?: string;
  address?: string;
  companyWebsite?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
}

async function importAgents() {
  const csvFile = process.argv[2];

  if (!csvFile) {
    console.error('❌ Please provide CSV file path');
    console.log('\nUsage: npm run import-agents <path-to-csv>');
    console.log('Example: npm run import-agents agents-import-template.csv\n');
    process.exit(1);
  }

  const filePath = path.resolve(csvFile);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log('\n📁 Reading agents from CSV file...\n');

  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const agents: AgentRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const agent: any = {};

    headers.forEach((header, index) => {
      agent[header] = values[index] || null;
    });

    agents.push(agent as AgentRow);
  }

  console.log(`📊 Found ${agents.length} agents to import\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const agent of agents) {
    try {
      // Check if agent already exists
      const existing = await prisma.agent.findUnique({
        where: { email: agent.email.toLowerCase() }
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${agent.email} (already exists)`);
        skipCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(agent.password, 10);

      // Create agent with fixed 10% commission
      await prisma.agent.create({
        data: {
          email: agent.email.toLowerCase(),
          password: hashedPassword,
          companyName: agent.companyName,
          contactName: agent.contactName,
          phone: agent.phone,
          country: agent.country || null,
          address: agent.address || null,
          companyWebsite: agent.companyWebsite || null,
          commissionRate: 10.0, // Fixed at 10%
          status: agent.status || 'ACTIVE',
          approvedAt: (agent.status || 'ACTIVE') === 'ACTIVE' ? new Date() : null
        }
      });

      console.log(`✅ Created: ${agent.email} (${agent.companyName}) - 10% commission`);
      successCount++;

    } catch (error: any) {
      console.error(`❌ Error importing ${agent.email}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📈 Import Summary:');
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total processed: ${agents.length}\n`);

  await prisma.$disconnect();
}

importAgents()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
