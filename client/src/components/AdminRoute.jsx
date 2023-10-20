import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminRoute() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isAdmin ? <Outlet /> : navigate('/sign-in');
}
