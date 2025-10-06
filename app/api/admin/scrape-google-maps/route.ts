import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { countries = ['USA'], limit = 5 } = await request.json();

    // Run the scraper script as a separate process
    return new Promise<NextResponse>((resolve) => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'scrape-google-maps.ts');
      const child = spawn('npx', [
        'tsx',
        scriptPath,
        JSON.stringify(countries),
        limit.toString()
      ], {
        cwd: process.cwd(),
        env: { ...process.env }
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        const text = data.toString();
        console.log(text);
        output += text;
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        console.error(text);
        errorOutput += text;
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Extract JSON results from output
          const resultsMatch = output.match(/===RESULTS_START===([\s\S]*?)===RESULTS_END===/);
          if (resultsMatch) {
            try {
              const results = JSON.parse(resultsMatch[1].trim());
              resolve(NextResponse.json(results));
            } catch (error) {
              resolve(NextResponse.json({
                success: false,
                error: 'Failed to parse scraper results'
              }, { status: 500 }));
            }
          } else {
            resolve(NextResponse.json({
              success: false,
              error: 'No results found in scraper output'
            }, { status: 500 }));
          }
        } else {
          resolve(NextResponse.json({
            success: false,
            error: `Scraper failed with code ${code}: ${errorOutput}`
          }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Scraping failed';
    console.error('Google Maps scraping error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
