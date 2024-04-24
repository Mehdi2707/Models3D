import {useNavigate} from 'react-router-dom';
import AuthenticationService from '../services/authenticationService';
import {useState, useEffect} from "react";

export function Login() {

    const history = useNavigate();

    useEffect(() => { document.title = 'Connexion - Models 3D'; });

    const [form, setForm] = useState({
        username: { value: '' },
        password: { value: '' },
    });

    const [message, setMessage] = useState('Vous êtes déconnecté. (admin@modelapi.com / password)');

    const handleInputChange = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        const newField = { [fieldName]: { value: fieldValue } };

        setForm({ ...form, ...newField});
    }

    const validateForm = () => {
        let newForm = form;

        // Validator username
        if(form.username.value.length < 3) {
            const errorMsg = 'Votre prénom doit faire au moins 3 caractères de long.';
            const newField = { value: form.username.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ username: newField } };
        } else {
            const newField = { value: form.username.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ username: newField } };
        }

        // Validator password
        if(form.password.value.length < 3) {
            const errorMsg = 'Votre mot de passe doit faire au moins 6 caractères de long.';
            const newField = {value: form.password.value, error: errorMsg, isValid: false};
            newForm = { ...newForm, ...{ password: newField } };
        } else {
            const newField = { value: form.password.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ password: newField } };
        }

        setForm(newForm);

        return newForm.username.isValid && newForm.password.isValid;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if(isFormValid) {
            setMessage('👉 Tentative de connexion en cours ...');
            AuthenticationService.login(form.username.value, form.password.value).then(isAuthenticated => {
                if(isAuthenticated.code === 401) {
                    setMessage('🔐 Identifiant ou mot de passe incorrect.');
                    return;
                }

                localStorage.setItem('token', isAuthenticated.token);
                history('/');

            });
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card hoverable">
                        <div className="card-stacked">
                            <div className="card-content">
                                {/* Form message */}
                                {message && <div className="form-group">
                                    <div className="card-panel grey lighten-5">
                                        {message}
                                    </div>
                                </div>}
                                {/* Field username */}
                                <div className="form-group">
                                    <label htmlFor="username">Identifiant</label>
                                    <input id="username" type="text" name="username" className="form-control" value={form.username.value} onChange={e => handleInputChange(e)}></input>
                                    {/* error */}
                                    {form.username.error &&
                                        <div className="card-panel red accent-1">
                                            {form.username.error}
                                        </div>}
                                </div>
                                {/* Field password */}
                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input id="password" type="password" name="password" className="form-control" value={form.password.value} onChange={e => handleInputChange(e)}></input>
                                    {/* error */}
                                    {form.password.error &&
                                        <div className="card-panel red accent-1">
                                            {form.password.error}
                                        </div>}
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