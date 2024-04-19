import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {formatDate} from "../helpers/formatDate.js";
import ModelsService from "../services/modelsService.js";
import {Loader} from "../components/Loader.jsx";


export function ModelDetails () {

    useEffect(() => { document.title = model ? model.title : 'Chargement...'; });

    const [model, setModel] = useState(null);
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);

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
                        <h2 className="header center">{ model.title }</h2>
                        <div className="card hoverable">
                            <div className="card-image">
                                {model.images.map(image => (
                                    <img key={image.id} src={'http://localhost:8000/assets/uploads/models/' + image.name} alt={image.name} style={{width: '250px', margin: '0 auto'}}/>
                                ))}
                                {isAdmin && (
                                    <Link to={`/models/edit/${model.id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                                        <i className="material-icons">edit</i>
                                    </Link>
                                )}
                            </div>
                            <div className="card-stacked">
                                <div className="card-content">
                                    <table className="bordered striped">
                                        <tbody>
                                        <tr>
                                            <td>Titre</td>
                                            <td><strong>{ model.title }</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td><strong>{ model.description }</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Tags</td>
                                            {model.tags.map(tag => (
                                                <td key={tag.id}><strong>{ tag.name }</strong></td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>Fichier</td>
                                            {model.files.map(file => (
                                                <td key={file.id}><strong>{ file.name }</strong></td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>Date de création</td>
                                            <td>{formatDate(model.createdAt)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
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
                // <h4 className="center">Aucun pokémon à afficher !</h4>
            )}
        </div>
    );
}