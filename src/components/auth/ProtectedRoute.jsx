import { Navigate } from 'react-router-dom';
import { getUser } from '../../utils/storage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
