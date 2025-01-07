import { AppLayout } from '@/layouts/layout';
import { useGetMe } from '@/services/me';

import { Outlet, Navigate } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const { isError, isFetched } = useGetMe();

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  if (isFetched) {
    if (isError) return <Navigate to={'/login'} />;

    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }
}
