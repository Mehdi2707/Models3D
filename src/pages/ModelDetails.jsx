import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {formatDate} from "../helpers/formatDate.js";
import ModelsService from "../services/modelsService.js";
import {Loader} from "../components/Loader.jsx";


export function ModelDetails () {
    const [model, setModel] = useState(null);
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);

    // Fonction pour initialiser le carousel
    const initializeCarousel = () => {
        const elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems, { fullWidth: true, indicators: true });
    };

    useEffect(() => {
        // Met à jour le titre de la page
        document.title = model ? `${model.title} - Models 3D` : 'Chargement...';

        // Initialise le carousel après que les images aient été chargées
        if (model && model.images.length > 0) {
            initializeCarousel();
        }
    }, [model]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const jwtPayload = JSON.parse(atob(token.split('.')[1]));
        const jwtRole = jwtPayload.roles;

        if (jwtRole.includes("ROLE_ADMIN")) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        ModelsService.getModel(id).then(model => setModel(model))
    }, [id]);

    return (
        <div>
            { model ? (
                <div className="row">
                    <div className="col s12 m8 offset-m2">
                        <h3 className="header center">{ model.title }</h3>
                        <div className="card hoverable">
                            <div className='card-image'>
                                <div className="col s12 m4 l2"></div>
                                    <div className="carousel carousel-slider center col s12 m4 l8 center">
                                        {model.images.map(image => (
                                            <div key={image.id} className='carousel-item'>
                                                <img key={image.id} src={'http://localhost:8000/assets/uploads/models/' + image.name} alt={image.name} /*style={{width: '250px', margin: '0 auto'}}*//>
                                            </div>
                                        ))}
                                    </div>
                                    {isAdmin && (
                                        <Link to={`/models/edit/${model.id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                                            <i className="material-icons">edit</i>
                                        </Link>
                                    )}
                                <div className="col s12 m4 l2"></div>
                            </div>
                            <div className="card-stacked">
                                <div className="card-content">
                                    <table className="bordered striped">
                                        <tbody>
                                            <tr>
                                                <td>Date de création</td>
                                                <td>{formatDate(model.createdAt)}</td>
                                            </tr>
                                            <tr>
                                                <td>Description</td>
                                                <td><strong>{ model.description }</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Tags</td>
                                                <td>
                                                    {model.tags.map(tag => (
                                                        <a className='waves-effect waves-light btn-small' href='/models' key={tag.id}><strong>{ tag.name }</strong></a>
                                                    ))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Fichiers</td>
                                                <td><a className='waves-effect waves-light btn'>Télécharger les fichiers</a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {model.files.map(file => (
                                        <p key={file.id}><strong>{ file.name }</strong></p>
                                    ))}
                                </div>
                                <div className="card-action">
                                    <Link to="/">Retour</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h4 className="center"><Loader /></h4>
            )}
        </div>
    );
}