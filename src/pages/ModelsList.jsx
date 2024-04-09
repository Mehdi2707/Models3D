import {useEffect, useState} from "react";
import {ModelCard} from "../components/ModelCard.jsx";
import ModelsService from "../services/modelsService.js";
import {Link} from "react-router-dom";
import {ModelSearch} from "../components/ModelSearch.jsx";

export function ModelsList () {

    const [models, setModels] = useState([])

    useEffect(() => {
        ModelsService.getModels().then(models => setModels(models))
    }, [])

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
            <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                  style={{position: 'fixed', bottom: '25px', right: '25px'}}
                  to="/model/add">
                <i className="material-icons">add</i>
            </Link>
        </div>
    </>
}