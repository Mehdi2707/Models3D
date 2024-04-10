import {useEffect, useState} from "react";
import {ModelCard} from "../components/ModelCard.jsx";
import ModelsService from "../services/modelsService.js";
import {Link, useSearchParams} from "react-router-dom";
import {ModelSearch} from "../components/ModelSearch.jsx";
import { Pagination } from "../components/Pagination.jsx";

export function ModelsList () {

    const [models, setModels] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [params] = useSearchParams();

    useEffect(() => {
        ModelsService.getModels(params.get('page')).then(models => {
            setModels(models.data);
            setTotalPages(models.pages);
            setCurrentPage(models.page)
        } )
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
            <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                  style={{position: 'fixed', bottom: '25px', right: '25px'}}
                  to="/model/add">
                <i className="material-icons">add</i>
            </Link>
        </div>
    </>
}