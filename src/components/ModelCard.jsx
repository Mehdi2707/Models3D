import './modelCard.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

export function ModelCard({ model, borderColor = '#ff7043' }) {

    const [color, setColor] = useState()
    const history = useNavigate()
    const showBorder = () => {
        setColor(borderColor)
    }
    const hideBorder = () => {
        setColor('#fbe9e7')
    }

    const goToModel = (id) => {
        history(`/models/${id}`)
    }

    return <div className="col s12 m6 l3" onClick={() => goToModel(model.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
        <div className="card waves-effect waves-block waves-light stylizedBorder" style={{ borderColor: color }}>
            <div className="card-image">
                {model.images.length > 0 ? (
                    <img src={'http://localhost:8000/assets/uploads/models/mini/400x400-' + model.images[0].name} alt={model.title} />
                )
                :
                (
                    <img src={'http://localhost:8000/assets/840298_1828.jpg'} alt={model.title} />
                )
                }
            </div>
            <div className="content" style={{textAlign: 'center'}}>
                <span className="card-title">{model.title.length > 25 ? (model.title.substring(0, 25) + '...') : (model.title)}</span>
            </div>
        </div>
    </div>
}