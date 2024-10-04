"use client";
import Grid from '../components/grid';

const ClientPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="flex items-center justify-center w-full h-full">
        <div className="max-w-full max-h-full">
          <Grid/>
        </div>
      </div>

    </div>
  );
};

export default ClientPage;
