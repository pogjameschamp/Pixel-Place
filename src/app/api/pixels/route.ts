// src/app/api/pixels/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const pixels = await prisma.pixel.findMany();

    const response = NextResponse.json(pixels);
    
    // Set no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("Error fetching pixels:", error);
    return NextResponse.json({ error: "Failed to fetch pixels" }, { status: 500 });
  }
}
