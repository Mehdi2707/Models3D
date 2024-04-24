import {ModelForm} from '../components/ModelForm.jsx';
import {useState, useEffect} from "react";
import Model from "../models/model.ts";

export function ModelAdd() {
    const [model] = useState(new Model())

    useEffect(() => { document.title = 'Ajouter un modèle - Models 3D'; });

    return (
        <div>
            {
                <div className="row">
                    <h2 className="header center">Ajouter un modèle</h2>
                    <ModelForm model={model} isEditForm={false}></ModelForm>
                </div>
            }
        </div>
    );
}