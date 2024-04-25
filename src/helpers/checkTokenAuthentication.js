export const checkTokenAuthentication = () => {
    const auth = localStorage.getItem('token');

    if (auth) {
        const jwtPayload = JSON.parse(atob(auth.split('.')[1]));
        const expirationTime = jwtPayload.exp * 1000; // Convertir en millisecondes
        const currentTime = Date.now();

        // Mettez à jour l'état d'authentification
        return (currentTime <= expirationTime);
    } else {
        return false;
    }
}