import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ModelsService from "../services/modelsService.js";

export function ModelForm({model, isEditForm}) {

    const history = useNavigate()

    const [form, setForm] = useState({
        // images: { value: model.images, isValid: true },
        title: { value: model.title, isValid: true },
        description: { value: model.description, isValid: true },
        file: { value: model.file, isValid: true },
    })

    const handleInputChange = (e) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value
        const newField = {[fieldName]: {value: fieldValue}}

        setForm({...form, ...newField})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isFormValid = validateForm()

        if(isFormValid) {
            // model.images = form.images.value
            model.title = form.title.value
            model.description = form.description.value
            model.file = form.file.value

            isEditForm ? updateModel() : addModel()
        }
    }

    const addModel = () => {
        ModelsService.addModel(model).then(() => history('/models'))
    }

    const updateModel = () => {
        ModelsService.updateModel(model).then(() => history(`/models/${model.id}`))
    }

    const isAddForm = () => {
        return !isEditForm
    }

    const validateForm = () => {
        let newForm = form

        // if(isAddForm())
        // {
        //     const start = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail"
        //     const end = ".png"
        //
        //     if(!form.images.value.startsWith(start) || !form.images.value.endsWith(end))
        //     {
        //         const errorMsg = "L'url n'est pas valide."
        //         const newField = { value: form.images.value, error: errorMsg, isValid: false }
        //         newForm = { ...form, ...{ images: newField } }
        //     }
        //     else
        //     {
        //         const newField = { value: form.images.value, error: '', isValid: true }
        //         newForm = { ...form, ...{ images: newField } }
        //     }
        // }

        if(!/^[a-zA-Zàéè ]{3,25}$/.test(form.title.value))
        {
            const errorMsg = 'Le nom du pokémon est requis (1-25).'
            const newField = { value: form.title.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ title: newField } }
        }
        else
        {
            const newField = { value: form.title.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ title: newField } }
        }

        if(!/^[a-zA-Zàéè ]{10,500}$/.test(form.description.value))
        {
            const errorMsg = 'Les points de vie du pokémon sont compris entre 0 et 999.'
            const newField = { value: form.description.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ description: newField } }
        }
        else
        {
            const newField = { value: form.description.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ description: newField } }
        }

        if(!/^[0-9]{1,2}$/.test(form.file.value))
        {
            const errorMsg = 'Les dégâts du pokémon sont compris entre 0 et 99.'
            const newField = { value: form.file.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ file: newField } }
        }
        else
        {
            const newField = { value: form.file.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ file: newField } }
        }

        setForm(newForm)
        return newForm.title.isValid && newForm.description.isValid && newForm.file.isValid
    }

    const deleteModel = () => {
        ModelsService.deleteModel(model).then(() => history("/models"))
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card hoverable">
                        {isEditForm && (
                            <div className="card-image">
                                {/*<img src={model.images[0].name} alt={model.title} style={{width: '250px', margin: '0 auto'}}/>*/}
                                <span className="btn-floating halfway-fab waves-effect waves-light">
                                    <i onClick={deleteModel} className="material-icons">delete</i>
                                </span>
                            </div>
                        )}
                        <div className="card-stacked">
                            <div className="card-content">
                                {/* Pokemon picture */}
                                {/*{isAddForm() && (*/}
                                {/*    <div className="form-group">*/}
                                {/*        <label htmlFor="name">Image</label>*/}
                                {/*        <input id="images" type="text" name="images" className="form-control" value={form.images.value} onChange={e => handleInputChange(e)}></input>*/}
                                {/*        {*/}
                                {/*            form.images.error &&*/}
                                {/*            <div className="card-panel red accent-1">*/}
                                {/*                {form.images.error}*/}
                                {/*            </div>*/}
                                {/*        }*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/* Pokemon name */}
                                <div className="form-group">
                                    <label htmlFor="title">Nom</label>
                                    <input id="title" type="text" name="title" className="form-control" value={form.title.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.title.error &&
                                        <div className="card-panel red accent-1">
                                            {form.title.error}
                                        </div>
                                    }
                                </div>
                                {/* Pokemon hp */}
                                <div className="form-group">
                                    <label htmlFor="description">Point de vie</label>
                                    <input id="description" type="text" name="description" className="form-control" value={form.description.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.description.error &&
                                        <div className="card-panel red accent-1">
                                            {form.description.error}
                                        </div>
                                    }
                                </div>
                                {/* Pokemon cp */}
                                <div className="form-group">
                                    <label htmlFor="file">Dégâts</label>
                                    <input id="file" type="text" name="file" className="form-control" value={form.file.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.file.error &&
                                        <div className="card-panel red accent-1">
                                            {form.file.error}
                                        </div>
                                    }
                                </div>
                                {/* Pokemon types */}
                                <div className="form-group">
                                    <label>Types</label>
                                    {/*{images.map(type => (*/}
                                    {/*    <div key={type} style={{marginBottom: '10px'}}>*/}
                                    {/*        <label>*/}
                                    {/*            <input id={type} type="checkbox" className="filled-in" value={type} disabled={!isTypesValid(type)} checked={hasType(type)} onChange={e => selectType(type, e)}></input>*/}
                                    {/*            <span>*/}
                                    {/*                <p className={formatType(type)}>{ type }</p>*/}
                                    {/*            </span>*/}
                                    {/*        </label>*/}
                                    {/*    </div>*/}
                                    {/*))}*/}
                                </div>
                            </div>
                            <div className="card-action center">
                                {/* Submit button */}
                                <button type="submit" className="btn">Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}