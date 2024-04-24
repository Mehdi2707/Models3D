import { useEffect, useState } from "react";
import { ModelCard } from "../components/ModelCard.jsx";
import ModelsService from "../services/modelsService.js";
import { Link, useSearchParams } from "react-router-dom";
import { ModelSearch } from "../components/ModelSearch.jsx";
import { Pagination } from "../components/Pagination.jsx";

export function ModelsList() {

    useEffect(() => { document.title = 'Models 3D'; });
    
    const [models, setModels] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [params] = useSearchParams();
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

        ModelsService.getModels(params.get('page')).then(models => {
            setModels(models.data);
            setTotalPages(models.pages);
            setCurrentPage(models.page)
        })
    }, [params])

    return <>
        <div className="container">
            <div className="row">
                <ModelSearch></ModelSearch>
            </div>
            <div className="row">
                {models.map(model => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
            {isAdmin && (
                <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                    style={{ position: 'fixed', bottom: '25px', right: '25px' }}
                    to="/model/add">
                    <i className="material-icons">add</i>
                </Link>
            )}
        </div>
    </>
}