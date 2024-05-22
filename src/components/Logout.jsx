import { useEffect } from 'react';
import {Navigate} from 'react-router-dom';

export function Logout({ setIsAuthenticated }) {

    // Supprimer le token d'authentification
    localStorage.removeItem('token');

    // Mettre à jour isAuthenticated après le rendu initial de Logout
    useEffect(() => {
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);
    
    // Rediriger l'utilisateur vers la page de connexion ou la page d'accueil
    return <Navigate to="/login" />;
}