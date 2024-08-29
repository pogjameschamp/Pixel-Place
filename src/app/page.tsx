import prisma from '@/lib/db';
import ClientPage from './clientpage';

export default async function HomePage() {
  const pixelsFromDb = await prisma.pixel.findMany();

  const pixels = pixelsFromDb.map(pixel => ({
    id: pixel.id,
    x: pixel.x,
    y: pixel.y,
    color: pixel.color, // Mapping `colour` to `color`
  }));

  return (
    <ClientPage pixels={pixels} />
  );
}
