import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;