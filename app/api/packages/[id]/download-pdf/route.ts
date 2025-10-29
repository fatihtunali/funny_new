import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get package from database
    const pkg = await prisma.package.findFirst({
      where: {
        OR: [
          { packageId: id },
          { slug: id }
        ]
      },
      select: {
        packageId: true,
        title: true,
        pdfUrl: true
      }
    });

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // If no PDF URL, return error
    if (!pkg.pdfUrl) {
      return NextResponse.json(
        { error: 'No PDF available for this package' },
        { status: 404 }
      );
    }

    // Try to find the PDF file
    const publicDir = join(process.cwd(), 'public');
    let pdfPath = join(publicDir, pkg.pdfUrl);

    // If the exact file doesn't exist, try to find by packageId
    if (!existsSync(pdfPath)) {
      // Look for files starting with the packageId
      const packagesDir = join(publicDir, 'packages');
      const files = await readdir(packagesDir);

      // Try to find a file that starts with the packageId
      const matchingFile = files.find((file: string) =>
        file.toLowerCase().startsWith(pkg.packageId.toLowerCase())
      );

      if (matchingFile) {
        pdfPath = join(packagesDir, matchingFile);
      }
    }

    // Check if file exists
    if (!existsSync(pdfPath)) {
      return NextResponse.json(
        { error: 'PDF file not found on server' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(pdfPath);

    // Create a safe filename
    const safeFilename = `${pkg.packageId}-${pkg.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // Return the PDF with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
