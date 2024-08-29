"use server"

import prisma from "@/lib/db"

export async function addPixel(x: number, y:number, colour:string) {
    await prisma.pixel.create({
        data: {
            color: colour,
            x: x,
            y: y,
        },
    });
}