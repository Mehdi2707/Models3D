import './modelCard.css'
import {useState} from "react";
import {formatDate} from "../helpers/formatDate.js";
import {useNavigate} from 'react-router-dom'

export function ModelCard ({model, borderColor = '#009688'}) {

    const [color, setColor] = useState()
    const history = useNavigate()
    const showBorder = () => {
        setColor(borderColor)
    }
    const hideBorder = () => {
        setColor('#f5f5f5')
    }

    const goToModel = (id) => {
        history(`/models/${id}`)
    }

    return <div className="col s6 m4" onClick={() => goToModel(model.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
        <div className="card horizontal" style={{borderColor: color}}>
            <div className="card-image">
                {model.images.map(image => (
                    <img key={model.slug} src={image.name} alt={model.title} />
                ))}
            </div>
            <div className="card-stacked">
                <div className="card-content">
                    <p>{model.title}</p>
                    <p>{model.file}</p>
                    <p>{model.description}</p>
                    <p><small>{formatDate(model.createdAt)}</small></p>
                    {/*{model.types.map(type => (*/}
                    {/*    <span key={type} className={formatType(type)}>{type}</span>*/}
                    {/*))}*/}
                </div>
            </div>
        </div>
    </div>
}