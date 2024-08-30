// src/app/api/pixels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    console.log("Fetching pixels from database...");
    const pixels = await prisma.pixel.findMany({
      include: {
        user: true, // Include the associated user information
      },
    });
    console.log("Pixels fetched:", pixels);

    const response = NextResponse.json(pixels);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("Error fetching pixels:", error);
    return NextResponse.json({ error: "Failed to fetch pixels" }, { status: 500 });
  }
}
