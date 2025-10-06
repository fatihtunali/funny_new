import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agentIds, subject, body } = await req.json();

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ error: 'No agents selected' }, { status: 400 });
    }

    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    // Fetch selected agents
    const agents = await prisma.agent.findMany({
      where: {
        id: { in: agentIds },
      },
      select: {
        id: true,
        email: true,
        contactName: true,
        companyName: true,
      },
    });

    // Send emails to all selected agents
    const emailPromises = agents.map(async (agent) => {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Dear ${agent.contactName},</h2>
          <div style="margin: 20px 0; line-height: 1.6;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>Funny Tourism Team</strong><br>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://funnytourism.com'}" style="color: #1e40af;">
              ${process.env.NEXT_PUBLIC_SITE_URL || 'https://funnytourism.com'}
            </a>
          </p>
        </div>
      `;

      return sendEmail({
        to: agent.email,
        subject: subject,
        html: emailContent,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Promotional email sent to ${agents.length} agent(s)`,
    });
  } catch (error) {
    console.error('Error sending promotional emails:', error);
    return NextResponse.json(
      { error: 'Failed to send promotional emails' },
      { status: 500 }
    );
  }
}
