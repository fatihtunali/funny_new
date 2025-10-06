import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Email configuration from .env
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const FROM_EMAIL = process.env.SMTP_FROM || 'info@funnytourism.com';
const BCC_EMAIL = 'info@funnytourism.com';
const DAILY_LIMIT = 100;
const LOGO_URL = 'https://www.funnytourism.com/images/FunnyLogo1.png';

// Email HTML template
function getEmailTemplate(companyName: string, city: string, country: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #0284c7; }
    .logo { max-width: 200px; }
    .content { padding: 30px 0; }
    .benefits { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .benefit-item { padding: 8px 0; }
    .benefit-item::before { content: "✅ "; color: #0284c7; }
    .cta { text-align: center; margin: 30px 0; }
    .button {
      background: #0284c7;
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      font-weight: bold;
    }
    .footer {
      border-top: 2px solid #e5e7eb;
      padding: 20px 0;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
    .signature { margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Funny Tourism" class="logo">
    </div>

    <div class="content">
      <p>Dear ${companyName} Team,</p>

      <p>I hope this email finds you well!</p>

      <p>I noticed that you offer travel services to clients in ${city}, ${country}. As a premier tour operator based in Turkey, we're reaching out to invite you to join our growing network of <strong>international travel agency partners</strong>.</p>

      <p><strong>Why Partner with Funny Tourism?</strong></p>

      <div class="benefits">
        <div class="benefit-item"><strong>10% Commission</strong> on all confirmed bookings</div>
        <div class="benefit-item"><strong>Ready-Made Packages</strong> - Istanbul, Cappadocia, Ephesus & more</div>
        <div class="benefit-item"><strong>Direct Flights</strong> from ${city} to Istanbul (IST)</div>
        <div class="benefit-item"><strong>Competitive Wholesale Pricing</strong> for your clients</div>
        <div class="benefit-item"><strong>24/7 English Support</strong> for you and your customers</div>
        <div class="benefit-item"><strong>Licensed & Insured</strong> Turkish tourism operator (10+ years)</div>
        <div class="benefit-item"><strong>Marketing Materials</strong> - brochures, images, itineraries</div>
        <div class="benefit-item"><strong>Flexible Payment Terms</strong> for established partners</div>
      </div>

      <p>Turkey is one of the fastest-growing tourism destinations, with increasing demand from travelers worldwide. With direct flights from ${city} to Istanbul, it's easier than ever for your clients to experience the wonders of Turkey.</p>

      <p><strong>Our Most Popular Packages:</strong></p>
      <ul>
        <li>🌟 Istanbul & Cappadocia Classic (7 days) - from €499</li>
        <li>🏛️ Turkey Highlights Tour (10 days) - from €899</li>
        <li>🎈 Cappadocia Balloon Adventure (4 days) - from €399</li>
        <li>⛵ Istanbul & Ephesus Discovery (8 days) - from €699</li>
      </ul>

      <div class="cta">
        <a href="https://www.funnytourism.com/agent/register" class="button">Become a Partner Today</a>
      </div>

      <p>Or simply reply to this email, and I'll personally send you:</p>
      <ul>
        <li>📋 Complete package catalog with pricing</li>
        <li>🤝 Partnership agreement details</li>
        <li>📸 High-quality marketing images</li>
        <li>📞 Direct contact for immediate support</li>
      </ul>

      <p>I'd love to discuss how we can work together to offer your clients unforgettable Turkey experiences while earning excellent commissions for your agency.</p>

      <p>Looking forward to hearing from you!</p>

      <div class="signature">
        <p><strong>Best regards,</strong></p>
        <p><strong>Fatih Tunali</strong><br>
        Partner Relations Manager<br>
        Funny Tourism<br>
        📧 info@funnytourism.com<br>
        📱 +90 537 830 20 00<br>
        🌐 <a href="https://www.funnytourism.com">www.funnytourism.com</a></p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Funny Tourism</strong> - Licensed Turkish Tour Operator | TURSAB Member</p>
      <p>Specializing in Istanbul, Cappadocia, Ephesus, Pamukkale & Mediterranean Tours</p>
      <p style="margin-top: 15px; font-size: 11px;">
        You're receiving this email because you operate a travel agency. If you'd prefer not to receive partnership opportunities, please reply with "Unsubscribe".
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Plain text version (fallback)
function getTextVersion(companyName: string, city: string, country: string): string {
  return `
Dear ${companyName} Team,

I hope this email finds you well!

I noticed that you offer travel services to clients in ${city}, ${country}. As a premier tour operator based in Turkey, we're reaching out to invite you to join our growing network of international travel agency partners.

WHY PARTNER WITH FUNNY TOURISM?

✅ 10% Commission on all confirmed bookings
✅ Ready-Made Packages - Istanbul, Cappadocia, Ephesus & more
✅ Direct Flights from ${city} to Istanbul (IST)
✅ Competitive Wholesale Pricing for your clients
✅ 24/7 English Support for you and your customers
✅ Licensed & Insured Turkish tourism operator (10+ years)
✅ Marketing Materials - brochures, images, itineraries
✅ Flexible Payment Terms for established partners

Turkey is one of the fastest-growing tourism destinations, with increasing demand from travelers worldwide. With direct flights from ${city} to Istanbul, it's easier than ever for your clients to experience the wonders of Turkey.

OUR MOST POPULAR PACKAGES:

🌟 Istanbul & Cappadocia Classic (7 days) - from €499
🏛️ Turkey Highlights Tour (10 days) - from €899
🎈 Cappadocia Balloon Adventure (4 days) - from €399
⛵ Istanbul & Ephesus Discovery (8 days) - from €699

NEXT STEPS:

1. Register as a partner: https://www.funnytourism.com/agent/register
2. Or reply to this email for:
   - Complete package catalog with pricing
   - Partnership agreement details
   - High-quality marketing images
   - Direct contact for immediate support

I'd love to discuss how we can work together to offer your clients unforgettable Turkey experiences while earning excellent commissions for your agency.

Looking forward to hearing from you!

Best regards,

Fatih Tunali
Partner Relations Manager
Funny Tourism
📧 info@funnytourism.com
📱 +90 537 830 20 00
🌐 www.funnytourism.com

---
Funny Tourism - Licensed Turkish Tour Operator | TURSAB Member
Specializing in Istanbul, Cappadocia, Ephesus, Pamukkale & Mediterranean Tours

You're receiving this email because you operate a travel agency. If you'd prefer not to receive partnership opportunities, please reply with "Unsubscribe".
  `.trim();
}

/**
 * Check how many emails sent today
 */
async function getEmailsSentToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.agentLead.count({
    where: {
      contacted: true,
      updatedAt: {
        gte: today
      }
    }
  });

  return count;
}

/**
 * Get leads ready for outreach (not yet contacted)
 */
async function getLeadsForOutreach(limit: number) {
  return await prisma.agentLead.findMany({
    where: {
      AND: [
        { contacted: false },
        { email: { not: null } },
        { email: { not: '' } }
      ]
    },
    orderBy: [
      { country: 'asc' },
      { city: 'asc' },
      { discovered: 'desc' }
    ],
    take: limit
  });
}

/**
 * Send email to a lead
 */
async function sendEmail(lead: any, transporter: any): Promise<boolean> {
  try {
    const htmlContent = getEmailTemplate(lead.companyName, lead.city || 'your city', lead.country);
    const textContent = getTextVersion(lead.companyName, lead.city || 'your city', lead.country);

    const mailOptions = {
      from: `"Funny Tourism - Partner Relations" <${FROM_EMAIL}>`,
      to: lead.email,
      bcc: BCC_EMAIL, // Always BCC to info@funnytourism.com
      subject: 'Turkey Tour Partnership Opportunity - 10% Commission',
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // Mark as contacted
    await prisma.agentLead.update({
      where: { id: lead.id },
      data: {
        contacted: true,
        notes: (lead.notes || '') + `\n[Outreach email sent: ${new Date().toISOString()}]`
      }
    });

    return true;
  } catch (error: any) {
    console.error(`Failed to send to ${lead.email}:`, error.message);
    return false;
  }
}

/**
 * Main outreach function
 */
async function sendOutreach() {
  console.log('\n📧 Starting Agent Outreach Campaign...\n');

  // Check email configuration
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.error('❌ Email not configured!');
    console.error('   Add SMTP_USER and SMTP_PASSWORD to .env file');
    console.error('   Example for Gmail:');
    console.error('   SMTP_HOST=smtp.gmail.com');
    console.error('   SMTP_PORT=587');
    console.error('   SMTP_USER=your-email@gmail.com');
    console.error('   SMTP_PASSWORD=your-app-password');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransporter(EMAIL_CONFIG);

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified\n');
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    process.exit(1);
  }

  // Check daily limit
  const sentToday = await getEmailsSentToday();
  const remaining = DAILY_LIMIT - sentToday;

  console.log(`📊 Daily Email Status:`);
  console.log(`   Sent today: ${sentToday}`);
  console.log(`   Daily limit: ${DAILY_LIMIT}`);
  console.log(`   Remaining: ${remaining}\n`);

  if (remaining <= 0) {
    console.log('⚠️  Daily limit reached. No more emails will be sent today.');
    console.log('   Next batch will send tomorrow.\n');
    return;
  }

  // Get leads to contact
  const leads = await getLeadsForOutreach(remaining);

  if (leads.length === 0) {
    console.log('✅ No new leads to contact. All leads have been contacted!\n');
    return;
  }

  console.log(`📬 Sending to ${leads.length} agencies...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const lead of leads) {
    const success = await sendEmail(lead, transporter);

    if (success) {
      console.log(`✅ ${lead.companyName} (${lead.city}, ${lead.country})`);
      successCount++;
    } else {
      console.log(`❌ ${lead.companyName} - Failed`);
      failCount++;
    }

    // Delay between emails (avoid spam filters)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
  }

  console.log('\n📊 Outreach Summary:');
  console.log(`   ✅ Successfully sent: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📧 Total sent today: ${sentToday + successCount}/${DAILY_LIMIT}\n`);

  if (sentToday + successCount >= DAILY_LIMIT) {
    console.log('⚠️  Daily limit reached. Remaining leads will be sent tomorrow.\n');
  }
}

/**
 * Export leads with email to Excel
 */
async function exportToExcel() {
  const leads = await prisma.agentLead.findMany({
    where: {
      email: {
        not: null,
        not: ''
      }
    },
    orderBy: [
      { contacted: 'asc' },
      { country: 'asc' },
      { city: 'asc' }
    ]
  });

  console.log('Company Name,Email,Phone,Website,City,Country,Contacted,Discovered');

  leads.forEach(lead => {
    console.log(
      `"${lead.companyName}","${lead.email}","${lead.phone || ''}","${lead.website || ''}","${lead.city || ''}","${lead.country}","${lead.contacted ? 'Yes' : 'No'}","${lead.discovered.toISOString().split('T')[0]}"`
    );
  });
}

// Run based on command
const command = process.argv[2] || 'send';

async function main() {
  switch (command) {
    case 'send':
      await sendOutreach();
      break;
    case 'export':
      await exportToExcel();
      break;
    case 'status':
      const sentToday = await getEmailsSentToday();
      const totalLeads = await prisma.agentLead.count({ where: { email: { not: null, not: '' } } });
      const contacted = await prisma.agentLead.count({ where: { contacted: true } });
      const remaining = totalLeads - contacted;

      console.log('\n📊 Email Campaign Status:\n');
      console.log(`   Total leads with email: ${totalLeads}`);
      console.log(`   Contacted: ${contacted}`);
      console.log(`   Remaining: ${remaining}`);
      console.log(`   Sent today: ${sentToday}/${DAILY_LIMIT}\n`);
      break;
    default:
      console.log('Usage:');
      console.log('  npm run send-outreach          # Send emails (max 100/day)');
      console.log('  npm run send-outreach export   # Export leads to Excel');
      console.log('  npm run send-outreach status   # Check campaign status');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
