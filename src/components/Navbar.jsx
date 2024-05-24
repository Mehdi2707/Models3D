import { useEffect } from "react";
import {Link} from "react-router-dom";
import { checkTokenAuthentication } from "../helpers/checkTokenAuthentication";
import { ModelSearch } from "../components/ModelSearch.jsx";

export function Navbar({ isAuthenticated, setIsAuthenticated }) {

    // Fonction pour gérer les changements dans localStorage
    const handleStorageChange = () => {
        const newAuthenticationStatus = checkTokenAuthentication();
        setIsAuthenticated(newAuthenticationStatus);
    };

    // Ajoute un écouteur d'événements pour détecter les changements dans localStorage
    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);

        // Nettoyez l'écouteur d'événements lorsque le composant se démonte
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [setIsAuthenticated]);

    return (
        <>
            <nav>
                <div className="nav-wrapper" style={{backgroundColor: '#ff6e40'}}>
                    <Link to="/" className="brand-logo" style={{ marginLeft: "1rem" }}>Models 3D</Link>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    {isAuthenticated ?
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><Link to="/logout">Déconnexion</Link></li>
                        </ul>
                        : 
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><Link to="/register">Inscription</Link></li>
                            <li><Link to="/login">Connexion</Link></li>
                        </ul>
                    }
                </div>
            </nav>
            {isAuthenticated ?
                <>
                    <ul className="sidenav" id="mobile-demo">
                        <li><Link to="/logout">Déconnexion</Link></li>
                    </ul>
                    <ModelSearch></ModelSearch>
                </>
                : 
                <ul className="sidenav" id="mobile-demo">
                    <li><Link to="/register">Inscription</Link></li>
                    <li><Link to="/login">Connexion</Link></li>
                </ul>
            }
        </>
    )
}