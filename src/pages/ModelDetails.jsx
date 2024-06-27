import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {formatDate} from "../helpers/formatDate.js";
import ModelsService from "../services/modelsService.js";
import {Loader} from "../components/Loader.jsx";
import Carousel from '../components/Carousel.jsx';

export function ModelDetails () {
    const [model, setModel] = useState(null);
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [fileSizes, setFileSizes] = useState({}); // État pour stocker les tailles des fichiers
    const [initializedFiles, setInitializedFiles] = useState([]); // État pour suivre les fichiers déjà initialisés
    const [loadingFiles, setLoadingFiles] = useState(true); // État global de chargement

    useEffect(() => {
        // Met à jour le titre de la page
        document.title = model ? `${model.title} - Models 3D` : 'Chargement...';
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

    const imageUrls = model ? model.images.map(image => `http://localhost:8000/assets/uploads/models/${image.name}`) : [];

    const filteredFiles = model ? model.files.filter(file => {
        const fileSize = fileSizes[file.id];
        return fileSize !== null && fileSize <= 25000;
      }).map(file => ({
        id: file.id,
        url: `http://localhost:8000/assets/uploads/models/${model.user.email}/${model.slug}/${file.name}`
      })) : [];

    const fetchFileSize = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl, { method: 'HEAD' });
            const size = response.headers.get('Content-Length');
            return size ? parseInt(size, 10) / 1024 : null; // Convertir la taille en ko
        } catch (error) {
            console.error("Erreur lors de la récupération de la taille du fichier:", error);
            return null;
        }
    };

    useEffect(() => {
        if (model) {
            const fileSizePromises = model.files.map(file => {
                const fileUrl = `http://localhost:8000/assets/uploads/models/${model.user.email}/${model.slug}/${file.name}`;
                return fetchFileSize(fileUrl).then(size => ({ id: file.id, size }));
            });

            Promise.all(fileSizePromises).then(sizes => {
                const sizesMap = {};
                sizes.forEach(({ id, size }) => {
                    sizesMap[id] = size;
                });
                setFileSizes(sizesMap);
            });
        }
    }, [model]);
      
    useEffect(() => {
        if (model && Object.keys(fileSizes).length > 0) {
            const loadingStatus = {}; // Initialisation de l'état de chargement
            model.files.forEach(file => {
                const fileSize = fileSizes[file.id];
                if (fileSize !== null && fileSize <= 25000 && !initializedFiles.includes(file.id)) {
                    const checkScriptLoaded = () => {
                        if (window.StlViewer) {
                            // Initialiser le visualiseur pour chaque fichier qui respecte la limite de taille
                            loadingStatus[file.id] = true; // Marquer comme en cours de chargement

                            new window.StlViewer(
                                document.getElementById(`stl_cont_${file.id}`),
                                {
                                    models: [{ id: file.id, filename: `http://localhost:8000/assets/uploads/models/${model.user.email}/${model.slug}/${file.name}` }]
                                }
                            );

                            // Utiliser MutationObserver pour surveiller le DOM
                            const observer = new MutationObserver((mutations) => {
                                mutations.forEach(mutation => {
                                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                        setInitializedFiles(prevFiles => [...prevFiles, file.id]);
                                        loadingStatus[file.id] = false;
                                        if (Object.values(loadingStatus).every(status => status === false)) {
                                            setLoadingFiles(false);
                                        }
                                    }
                                });
                            });
                            
                            observer.observe(document.getElementById(`stl_cont_${file.id}`), { childList: true });
                            
                            // Déconnecter l'observateur lorsqu'il n'est plus nécessaire.
                            return () => observer.disconnect();
                            
                        } else {
                            setTimeout(checkScriptLoaded, 100);
                        }
                    };
                    checkScriptLoaded();
                }
            });
        }
    }, [model, fileSizes, initializedFiles]);
// Modifier le fonctionnement du carousel (voir pourquoi il faut tourner le carousel pour lancer l'affichage du modele 3d) / adapter le code dans les differentes pages et sur l'api

    return (
        <div>
            { model ? (
                <div className="row">
                    <div className="col s12 m8 offset-m2">
                        <div className="card hoverable">
                            <h3 className="header center">{ model.title }</h3>
                            <div className='card-image'>
                                <div className="col s12 m4 l2"></div>
                                <Carousel images={imageUrls} files={filteredFiles} loadingFiles={loadingFiles} />
                                {/* <div className="carousel carousel-slider center col s12 m4 l8 center"> */}
                                    {/* {model.images.map(image => ( */}
                                        {/* <div key={image.id} className='carousel-item'> */}
                                            {/* <img key={image.id} src={'http://localhost:8000/assets/uploads/models/' + image.name} alt={image.name} /> */}
                                        {/* </div> */}
                                    {/* ))} */}
                                    {/* {model.files.map(file => ( */}
                                        {/* fileSizes[file.id] !== null && fileSizes[file.id] <= 25000 && ( */}
                                            {/* <div key={file.id} id={`stl_cont_${file.id}`} className={model.images.length > 0 ? 'carousel-item' : 'carousel-item active'} style={model.images.length > 0 ? {} : { zIndex: 0, opacity: 1, visibility: 'visible', transform: 'translateX(0px) translateX(0px) translateX(0px) translateZ(0px)' }}> */}
                                                {/* {loadingFiles && <Loader />} Afficher le loader pendant le chargement */}
                                            {/* </div> */}
                                        {/* ) */}
                                    {/* ))} */}
                                {/* </div> */}
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
                                                <td>Utilisateur</td>
                                                <td>{model.user.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Description</td>
                                                <td style={{ whiteSpace: 'pre-wrap' }}><strong>{ model.description }</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Tags</td>
                                                <td>
                                                    {model.tags.map(tag => (
                                                        <a className='waves-effect waves-light btn-small' href={'/models/tag/' + tag.name} key={tag.id}><strong>{ tag.name }</strong></a>
                                                    ))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Fichiers</td>
                                                <td>
                                                    {model.files.length > 0 && (
                                                        <a href={'http://localhost:8000/assets/uploads/models/' + model.file} download={model.file} target="_blank" className='waves-effect waves-light btn'>Télécharger les fichiers</a>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {model.files.map(file => (
                                        <p key={file.id}><strong>{ file.name }</strong></p>
                                    ))}
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