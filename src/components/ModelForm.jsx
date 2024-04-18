import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ModelsService from "../services/modelsService.js";

export function ModelForm({model, isEditForm}) {

    const history = useNavigate()

    const [form, setForm] = useState({
        title: { value: model.title, isValid: true },
        description: { value: model.description, isValid: true },
        file: { value: model.file, isValid: true },
        images: { value: [], isValid: true }
    })

    const handleInputChange = (e) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value
        const newField = {[fieldName]: {value: fieldValue}}

        setForm({...form, ...newField})
    }

    const handleImageChange = (e) => {
        const imageFiles = e.target.files;
        const newField = {['images']: {value: Array.from(imageFiles)}};

        setForm({...form, ...newField})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isFormValid = validateForm()

        if(isFormValid) {
            model.title = form.title.value
            model.description = form.description.value
            model.file = form.file.value
            model.images = form.images.value

            isEditForm ? updateModel() : addModel()
        }
    }

    const addModel = () => {
        ModelsService.addModel(model).then(() => history('/models'))
    }

    const updateModel = () => {
        ModelsService.updateModel(model).then(() => history(`/models/${model.id}`))
    }

    const validateForm = () => {
        let newForm = form

        const allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

        if (form.images.value && form.images.value.length > 0)
        {
            let hasInvalidImage = false;
            form.images.value.forEach(image => {
                if(allowedExtension.indexOf(image.type) === -1)
                {
                    const errorMsg = "Le type de fichier n'est pas valide. (" + image.name + ")"
                    const newField = { value: image, error: errorMsg, isValid: false }
                    newForm = { ...form, ...{ images: newField } }
                    hasInvalidImage = true;
                }
            });

            if (!hasInvalidImage) {
                const newField = { value: form.images.value, error: '', isValid: true }
                newForm = { ...form, ...{ images: newField } }
            }
        }

        if(!/^[a-zA-Zàçâéèô:\/ -.]{3,250}$/.test(form.title.value))
        {
            const errorMsg = 'Le titre du modèle est requis (3-250).'
            const newField = { value: form.title.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ title: newField } }
        }
        else
        {
            const newField = { value: form.title.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ title: newField } }
        }

        if(!/^[a-zA-Z0-9àçâéèô:\/ -.]{10,1000}$/.test(form.description.value))
        {
            const errorMsg = 'La description du modèle est requis (10-1000).'
            const newField = { value: form.description.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ description: newField } }
        }
        else
        {
            const newField = { value: form.description.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ description: newField } }
        }

        if(!/^[a-zA-Zàçâéèô:\/ -.]{3,25}$/.test(form.file.value))
        {
            const errorMsg = 'Le fichier est requis (3-25).'
            const newField = { value: form.file.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ file: newField } }
        }
        else
        {
            const newField = { value: form.file.value, error: '', isValid: true }
            newForm = { ...newForm, ...{ file: newField } }
        }

        setForm(newForm)
        return newForm.title.isValid && newForm.description.isValid && newForm.file.isValid && newForm.images.isValid
    }

    const deleteModel = () => {
        ModelsService.deleteModel(model).then(() => history("/models"))
    }

    const deleteImage = (id) => {
        const imageElement = document.getElementById(`image-${id}`);
        ModelsService.deleteImage(id).then(() => imageElement.remove())
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card hoverable">
                        {isEditForm && (
                            <div className="card-image">
                                {model.images.map(image => (
                                    <div key={image.id} id={`image-${image.id}`}>
                                        <img src={'http://localhost:8000/assets/uploads/models/' + image.name} alt={model.title} style={{width: '250px', margin: '0 auto'}}/>
                                        <span className="waves-effect waves-light btn">
                                            <i onClick={() => deleteImage(image.id)} className="material-icons">delete</i>
                                        </span>
                                    </div>
                                ))}
                                <span className="btn-floating halfway-fab waves-effect waves-light">
                                    <i onClick={deleteModel} className="material-icons">delete</i>
                                </span>
                            </div>
                        )}
                        <div className="card-stacked">
                            <div className="card-content">
                                {/* Modèle images */}
                                <div className="form-group">
                                    <label htmlFor="images">Image</label>
                                    <input id="images" type="file" name="images" multiple className="form-control" onChange={e => handleImageChange(e)}></input>
                                    {
                                        form.images.error &&
                                        <div className="card-panel red accent-1">
                                            {form.images.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle title */}
                                <div className="form-group">
                                    <label htmlFor="title">Titre</label>
                                    <input id="title" type="text" name="title" className="form-control" value={form.title.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.title.error &&
                                        <div className="card-panel red accent-1">
                                            {form.title.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle description */}
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input id="description" type="text" name="description" className="form-control" value={form.description.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.description.error &&
                                        <div className="card-panel red accent-1">
                                            {form.description.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle fichier */}
                                <div className="form-group">
                                    <label htmlFor="file">Fichier</label>
                                    <input id="file" type="text" name="file" className="form-control" value={form.file.value} onChange={e => handleInputChange(e)}></input>
                                    {
                                        form.file.error &&
                                        <div className="card-panel red accent-1">
                                            {form.file.error}
                                        </div>
                                    }
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