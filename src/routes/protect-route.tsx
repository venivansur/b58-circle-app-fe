import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/layouts/layout';

const ProtectedPage = () => {
  const { user, clearUser } = useAuthStore();

  useEffect(() => {
    if (!user || !user.username) {
      clearUser();
    }
  }, [user, clearUser]);

  if (!user || !user.username) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedPage;
