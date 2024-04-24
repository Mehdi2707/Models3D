import {useParams} from 'react-router-dom';
import {ModelForm} from '../components/ModelForm.jsx';
import {useEffect, useState} from "react";
import ModelsService from "../services/modelsService.js";
import {Loader} from "../components/Loader.jsx";

export function ModelEdit() {

    useEffect(() => { document.title = model ? 'Éditer ' + model.title + ' - Models 3D' : 'Chargement...'; });
    
    const [model, setModel] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        ModelsService.getModel(id).then(model => setModel(model))
    }, [id]);

    return (
        <div>
            { model ? (
                <div className="row">
                    <h2 className="header center">Éditer { model.title }</h2>
                    <ModelForm model={model} isEditForm={true}></ModelForm>
                </div>
            ) : (
                <h4 className="center"><Loader /></h4>
                // <h4 className="center">Aucun pokémon à afficher !</h4>
            )}
        </div>
    );
}