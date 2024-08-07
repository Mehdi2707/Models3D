import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ModelsService from "../services/modelsService.js";
import TagsService from "../services/tagsService.js";
import ImagesService from "../services/imagesService.js";
import FilesService from "../services/filesServices.js";

export function ModelForm({model, isEditForm}) {

    const history = useNavigate()
    const [term, setTerm] = useState('');
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState(false);
    const [selectedTags, setSelectedTags] = useState(model.tags);

    useEffect(() => {
        const inputElems = document.querySelectorAll('input#title, textarea#description');
        M.CharacterCounter.init(inputElems);
    }, []);

    const [form, setForm] = useState({
        title: { value: model.title, isValid: true },
        description: { value: model.description, isValid: true },
        files: { value: [], isValid: true },
        tags: { value: selectedTags, isValid: true },
        images: { value: [], isValid: true }
    })

    const handleInputChange = (e) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value
        const newField = {[fieldName]: {value: fieldValue}}

        setForm({...form, ...newField})
    }

    const handleTagChange = (e) => {
        const fieldValue = e.target.value

        setTerm(fieldValue);

        if(fieldValue.length <= 1) {
            setSearch(false);
            setTags([]);
            return;
        }

        TagsService.searchTag(fieldValue).then(tags => setTags(tags));
        setSearch(true);
    }

    const handleTagClick = (e, tag = null) => {
        // Récupérez le nom du tag à partir de l'élément cliqué
        const tagName = e.target.textContent;

        // Vérifiez si le tag est déjà sélectionné
        if (!selectedTags.some(t => t.name === tagName)) {
            // Ajoutez un nouveau tag à la liste des tags sélectionnés
            let updatedTags;
            if (tag) {
                // Si un tag est passé, utilisez ses propriétés
                updatedTags = [...selectedTags, { id: tag.id, name: tag.name }];
            } else {
                // Sinon, créez un nouveau tag avec un ID unique
                updatedTags = [...selectedTags, { id: Date.now(), name: tagName }];
            }

            // Mettez à jour l'état des tags sélectionnés
            setSelectedTags(updatedTags);

            // Mettez à jour l'état du formulaire
            setForm({ ...form, tags: { value: updatedTags } });
        }

        setTerm('');
        setSearch(false);
    }

    const handleTagRemove = (tag) => {
        const updatedTags = selectedTags.filter(t => t !== tag);
        setSelectedTags(updatedTags);
        setForm({ ...form, tags: { value: updatedTags } });
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const fieldName = e.target.name;
        const newField = {[fieldName]: {value: Array.from(files)}};

        setForm({...form, ...newField})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isFormValid = validateForm()

        if(isFormValid) {
            model.title = form.title.value
            model.description = form.description.value
            model.files = form.files.value
            model.tags = form.tags.value
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
        // vérification des fichiers 3d à faire

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

        if (form.tags.value && form.tags.value.length > 0)
        {
            form.tags.value.forEach(tag => {
                if(!/^[a-zA-Z0-9àçâéèô:\/ -.]{2,250}$/.test(tag.name))
                {
                    const errorMsg = 'Le tag ' + tag.name + ' contient un/des caractère(s) invalide (2-250).'
                    const newField = { value: tag, error: errorMsg, isValid: false }
                    newForm = { ...newForm, ...{ tags: newField } }
                }
                else
                {
                    const newField = { value: form.tags.value, error: '', isValid: true }
                    newForm = { ...newForm, ...{ tags: newField } }
                }
            });
        }

        if(!form.title.value)
        {
            const errorMsg = 'Le titre du modèle est requis (3-250).'
            const newField = { value: form.title.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ title: newField } }
        }
        else
        {
            // if(!/^[a-zA-Z0-9àçâéèô:\/ -.]{3,250}$/.test(form.title.value))
            if(form.title.value.length < 3 || form.title.value.length > 250)
            {
                // const errorMsg = 'Le titre du modèle contient un/des caractère(s) invalide (3-250).'
                const errorMsg = 'Le titre du modèle ne contient pas le nombre de caractères requis (3-250).'
                const newField = { value: form.title.value, error: errorMsg, isValid: false }
                newForm = { ...newForm, ...{ title: newField } }
            }
            else
            {
                const newField = { value: form.title.value, error: '', isValid: true }
                newForm = { ...newForm, ...{ title: newField } }
            }
        }

        if(!form.description.value)
        {
            const errorMsg = 'La description du modèle est requis (10-1000).'
            const newField = { value: form.description.value, error: errorMsg, isValid: false }
            newForm = { ...newForm, ...{ description: newField } }
        }
        else
        {
            // if(!/^[a-zA-Z0-9àçâéèô:\/ -.?\n]{10,1000}$/.test(form.description.value))
            if(form.description.value.length < 10 || form.description.value.length > 1000)
            {
                // const errorMsg = 'La description du modèle contient un/des caractère(s) invalide (10-1000).'
                const errorMsg = 'Le description du modèle ne contient pas le nombre de caractères requis (10-1000).'
                const newField = { value: form.description.value, error: errorMsg, isValid: false }
                newForm = { ...newForm, ...{ description: newField } }
            }
            else
            {
                const newField = { value: form.description.value, error: '', isValid: true }
                newForm = { ...newForm, ...{ description: newField } }
            }
        }

        setForm(newForm)
        return newForm.title.isValid && newForm.description.isValid && newForm.images.isValid && newForm.tags.isValid
    }

    const deleteModel = () => {
        ModelsService.deleteModel(model).then(() => history("/models"))
    }

    const deleteImage = (id) => {
        const imageElement = document.getElementById(`image-${id}`);
        ImagesService.deleteImage(id).then(() => imageElement.remove())
    }

    const deleteFile = (id) => {
        const fileElement = document.getElementById(`file-${id}`);
        FilesService.deleteFile(id, model.slug).then(() => fileElement.remove())
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card hoverable">
                        {isEditForm && (
                            <div className="card-content">
                                {model.images.map(image => (
                                    <div className="card-image" key={image.id} id={`image-${image.id}`}>
                                        <img src={'http://localhost:8000/assets/uploads/models/' + image.name} alt={model.title} style={{width: '250px', margin: '0 auto'}}/>
                                        <span className="btn-floating halfway-fab waves-effect waves-light">
                                            <i onClick={() => deleteImage(image.id)} className="material-icons">delete</i>
                                        </span>
                                    </div>
                                ))}
                                {model.files.map(file => (
                                    <div key={file.id} id={`file-${file.id}`}>
                                        <a href={'http://localhost:8000/assets/uploads/models/' + file.name} target="_blank">{file.name}</a>
                                        <span className="waves-effect waves-light btn">
                                            <i onClick={() => deleteFile(file.id)} className="material-icons">delete</i>
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
                                    <div className="file-field input-field">
                                        <div className="btn">
                                            <span htmlFor="images">Image</span>
                                            <input id="images" type="file" name="images" multiple className="form-control" onChange={e => handleFileChange(e)}></input>
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" placeholder="Upload d'une ou plusieurs images"/>
                                        </div>
                                    </div>
                                    {
                                        form.images.error &&
                                        <div className="card-panel red accent-1">
                                            {form.images.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle fichiers */}
                                <div className="form-group">
                                    <div className="file-field input-field">
                                        <div className="btn">
                                            <span htmlFor="files">Fichier 3D</span>
                                            <input id="files" type="file" name="files" multiple className="form-control" onChange={e => handleFileChange(e)}></input>
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" placeholder="Upload d'un ou plusieurs fichiers"/>
                                        </div>
                                    </div>
                                    {
                                        form.files.error &&
                                        <div className="card-panel red accent-1">
                                            {form.files.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle title */}
                                <div className="form-group">
                                    <div className="input-field">
                                        <input id="title" type="text" name="title" className="form-control" data-length="250" value={form.title.value} onChange={e => handleInputChange(e)}></input>
                                        <label htmlFor="title">Titre</label>
                                    </div>
                                    {
                                        form.title.error &&
                                        <div className="card-panel red accent-1">
                                            {form.title.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle description */}
                                <div className="form-group">
                                    <div className="input-field">
                                    <textarea id="description" name="description" className="materialize-textarea" value={form.description.value} onChange={e => handleInputChange(e)} data-length="1000"></textarea>
                                        <label htmlFor="description">Description</label>
                                    </div>
                                    {
                                        form.description.error &&
                                        <div className="card-panel red accent-1">
                                            {form.description.error}
                                        </div>
                                    }
                                </div>
                                {/* Modèle tags */}
                                <div className="form-group">
                                    <label htmlFor="tags">Tags</label>
                                    <input id="tags" type="text" name="tags" className="form-control" value={term} onChange={e => handleTagChange(e)} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}></input>
                                    {
                                        form.tags.error &&
                                        <div className="card-panel red accent-1">
                                            {form.tags.error}
                                        </div>
                                    }
                                </div>
                                <ul className='collection' hidden={!search}>
                                    {tags.length == 0 && search &&
                                     <li className='collection-item' style={{cursor: "pointer"}} onClick={e => handleTagClick(e)}>{term.toLowerCase()}</li>}
                                    {tags.map((tag) => (
                                        <li key={tag.id} className="collection-item" style={{cursor: "pointer"}} onClick={e => handleTagClick(e, tag)}>
                                            {tag.name}
                                        </li>
                                    ))}
                                </ul>
                                <div>
                                    {selectedTags.map((tag) => (
                                        <div key={tag.id} className="chip">
                                            {tag.name}
                                            <i className="close material-icons" onClick={() => handleTagRemove(tag)}>close</i>
                                        </div>
                                    ))}
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