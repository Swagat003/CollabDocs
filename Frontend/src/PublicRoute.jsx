import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return !isAuthenticated ? element : <Navigate to="/dashboard" />;
};

export default PublicRoute;