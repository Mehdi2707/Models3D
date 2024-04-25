import { Navigate, Outlet} from 'react-router-dom';

const PrivateRoute = ({children, role, isAuthenticated}) => {

    if (!isAuthenticated) {
        // Si le JWT est expiré ou inexistant, rediriger vers la page de connexion
        return <Navigate to="/login" />;
    }

    const auth = localStorage.getItem('token');

    const jwtPayload = JSON.parse(atob(auth.split('.')[1]));
    const jwtRole = jwtPayload.roles;

    if (role && !jwtRole.includes(role)) {
        return <Navigate to="/" />;
    }

    return children ? children : <Outlet />
}

export default PrivateRoute;