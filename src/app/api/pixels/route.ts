// src/app/api/pixels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    console.log("Fetching pixels from database using raw query...");
    const pixels = await prisma.$queryRaw`SELECT * FROM Pixel`;
    console.log("Pixels fetched:", pixels);
    return NextResponse.json(pixels);
  } catch (error) {
    console.error("Error fetching pixels with raw query:", error);
    return NextResponse.json({ error: "Failed to fetch pixels" }, { status: 500 });
  }
}
