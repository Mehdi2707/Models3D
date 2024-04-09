import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModelsService from '../services/modelsService';

export function ModelSearch() {

    const [term, setTerm] = useState('');
    const [models, setModels] = useState([]);

    const handleInputChange = (e) => {
        const term = e.target.value;
        setTerm(term);

        if(term.length <= 1) {
            setModels([]);
            return;
        }

        ModelsService.searchModel(term).then(models => setModels(models));
    }

    return (
        <div className="row">
            <div className="col s12 m6 offset-m3">
                <div className="card">
                    <div className="card-content">
                        <div className="input-field">
                            <input type="text" placeholder="Rechercher un pokémon" value={term} onChange={e => handleInputChange(e)} />
                        </div>
                        <div className='collection'>
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