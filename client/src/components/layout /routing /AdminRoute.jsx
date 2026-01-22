import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute({ redirectTo = '/' }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to='/login' replace />;

  return role === 'admin' ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
