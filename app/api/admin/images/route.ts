import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await requireAdmin();

    const imagesDirectory = path.join(process.cwd(), 'public', 'images');

    // Read all files in the images directory
    const files = fs.readdirSync(imagesDirectory);

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Generate a display name from filename
        const nameWithoutExt = path.basename(file, path.extname(file));
        const displayName = nameWithoutExt
          .replace(/[-_]/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace(/\s+/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          path: `/images/${file}`,
          name: displayName,
          filename: file
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
