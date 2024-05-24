import { useEffect, useState } from "react";
import { ModelCard } from "../components/ModelCard.jsx";
import ModelsService from "../services/modelsService.js";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { Pagination } from "../components/Pagination.jsx";
import {Loader} from "../components/Loader.jsx";

export function ModelsList() {

    useEffect(() => { document.title = 'Models 3D'; });
    
    const [models, setModels] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [params] = useSearchParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const { tag } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const jwtPayload = JSON.parse(atob(token.split('.')[1]));
        const jwtRole = jwtPayload.roles;

        if (jwtRole.includes("ROLE_ADMIN")) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        if (tag) {
            ModelsService.getModelTag(tag, params.get('page')).then(models => setModels(models.data));
        }
        else {
            ModelsService.getModels(params.get('page')).then(models => {
                setModels(models.data);
                setTotalPages(models.pages);
                setCurrentPage(models.page);
            })
        }
    }, [params, tag])

    return <>
            { models.length > 0 ? (
                <div className="container">
                    <div className="row">
                        {models.map(model => (
                            <ModelCard key={model.id} model={model} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} tag={tag} />
                    {isAdmin && (
                        <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                            style={{ position: 'fixed', bottom: '25px', right: '25px' }}
                            to="/model/add">
                            <i className="material-icons">add</i>
                        </Link>
                    )}
                </div>
            ) : (
                <h4 className="center"><Loader /></h4>
            )}
           </>
}