import prisma from '@/lib/db';
import ClientPage from './clientpage';

export async function getServerSideProps() { // Use getServerSideProps instead of getStaticProps
  try {
    const pixelsFromDb = await prisma.pixel.findMany();
    console.log("Fetched pixels from DB (Production):", pixelsFromDb);

    const pixels = pixelsFromDb.map(pixel => ({
      id: pixel.id,
      x: pixel.x,
      y: pixel.y,
      color: pixel.color,
    }));

    return {
      props: {
        pixels,
      },
    };
  } catch (error) {
    console.error("Error fetching pixels in production:", error);
    return {
      props: {
        pixels: [], // Fallback in case of error
      }
    };
  }
}

export default function HomePage({ pixels }: { pixels: any[] }) {
  return (
    <ClientPage pixels={pixels} />
  );
}
