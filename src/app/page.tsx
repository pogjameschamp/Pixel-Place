import prisma from '@/lib/db';

export const revalidate = 0; // Disable caching entirely (SSR on every request)

export default async function HomePage() {
  // Fetch pixels from the database
  const pixels = await prisma.pixel.findMany();

  return (
    <div>
      {pixels.map((pixel) => (
        <div key={pixel.id}>
          <p>Pixel ID: {pixel.id}</p>
          <p>Position: ({pixel.x}, {pixel.y})</p>
          <p>Color: {pixel.color}</p>
        </div>
      ))}
    </div>
  );
}
