// src/app/api/pixels/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const pixels = await prisma.pixel.findMany();
    return NextResponse.json(pixels);
  } catch (error) {
    console.error("Error fetching pixels:", error);
    return NextResponse.json({ error: "Failed to fetch pixels" }, { status: 500 });
  }
}
