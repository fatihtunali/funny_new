import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface AdminPayload {
  adminId: string;
  email: string;
}

export async function getAdminFromToken(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as AdminPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminPayload> {
  const admin = await getAdminFromToken();

  if (!admin) {
    throw new Error('Unauthorized');
  }

  return admin;
}
