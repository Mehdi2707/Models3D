import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModelsService from '../services/modelsService';
import './modelSearch.css'

export function ModelSearch() {

    const [term, setTerm] = useState('');
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState(false);

    const handleInputChange = (e) => {
        const term = e.target.value;
        setTerm(term);

        if(term.length <= 1) {
            setSearch(false);
            setModels([]);
            return;
        }

        ModelsService.searchModel(term).then(models => setModels(models.data));
        setSearch(true);
    }

    return (
            <div className="row">
                <div className="col s12 m6 offset-m3">
                    <div className="card">
                        <div className="center">
                            <div className="input-field">
                                <input type="text" placeholder="Rechercher un modèle" value={term} onChange={e => handleInputChange(e)} />
                            </div>
                            <div className='collection' hidden={!search}>
                                {models.length == 0 && search &&
                                <p className='collection-item'>Aucun résultat</p>}
                                {models.map((model) => (
                                    <Link key={model.id} to={`/models/${model.id}`} className="collection-item">
                                        {model.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}