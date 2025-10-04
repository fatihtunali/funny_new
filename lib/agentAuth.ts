import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

interface AgentToken {
  id: string;
  email: string;
  companyName: string;
  status: string;
}

export async function getAgentFromToken(): Promise<AgentToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('agent-token');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as AgentToken;

    // Verify agent still exists and is active
    const agent = await prisma.agent.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        companyName: true,
        status: true,
      },
    });

    if (!agent || agent.status !== 'ACTIVE') {
      return null;
    }

    return {
      id: agent.id,
      email: agent.email,
      companyName: agent.companyName,
      status: agent.status,
    };
  } catch (error) {
    return null;
  }
}

export async function requireAgent(): Promise<AgentToken> {
  const agent = await getAgentFromToken();

  if (!agent) {
    throw new Error('Unauthorized - Active agent session required');
  }

  return agent;
}
