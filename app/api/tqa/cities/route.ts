import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

/**
 * GET /api/tqa/cities?search=ist
 * Search Turkish cities for autocomplete
 */
export async function GET(request: NextRequest) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    if (search.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    // Create direct MySQL connection
    connection = await mysql.createConnection(process.env.DATABASE_URL!);

    // Search cities from database (MySQL LIKE is case-insensitive by default)
    const [rows] = await connection.execute(
      `SELECT name
       FROM TurkishCity
       WHERE isActive = 1
         AND (name LIKE ? OR displayName LIKE ?)
       ORDER BY popularityScore DESC, name ASC
       LIMIT 10`,
      [`%${search}%`, `%${search}%`]
    );

    // Extract city names from results
    const cityNames = (rows as any[]).map(row => row.name);

    return NextResponse.json({ cities: cityNames });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ cities: [] }, { status: 500 });
  } finally {
    // Always close the connection
    if (connection) {
      await connection.end();
    }
  }
}
