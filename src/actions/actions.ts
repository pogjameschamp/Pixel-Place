"use server";

import prisma from "@/lib/db";

export async function addPixel(x: number, y: number, color: string, userId: string) {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist`);
    }
  
    // Create the pixel entry if the user exists
    await prisma.pixel.create({
      data: {
        color: color,
        x: x,
        y: y,
        userId: userId, // This must match a valid userId in the User table
      },
    });
  }

export async function createUser({ id, name, email }: { id: string, name: string, email: string }) {
  // Check if the user already exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // If the user doesn't exist, create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        id,
        name,
        email,
      },
    });
  }

  return user;
}