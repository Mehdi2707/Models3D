import { Navigate, Outlet} from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const auth = localStorage.getItem('token');

    // Vérifier si le JWT est expiré en décodant le payload
    const jwtPayload = JSON.parse(atob(auth.split('.')[1]));
    const expirationTime = jwtPayload.exp * 1000; // Convertir en millisecondes
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
        // Si le JWT est expiré, rediriger vers la page de connexion
        return <Navigate to="/login" />;
    }

    if(!auth)
        return <Navigate to="/login" />

    return children ? children : <Outlet />
}

export default PrivateRoute;