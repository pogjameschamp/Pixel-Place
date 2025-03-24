"use client";
import ProtectedRoute from '@/components/protectedroute';
import Grid from '../components/grid';

const ClientPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Grid />
    </ProtectedRoute>
  );
};

export default ClientPage;
