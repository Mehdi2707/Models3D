import {useNavigate, Navigate} from 'react-router-dom';
import AuthenticationService from '../services/authenticationService';
import {useState, useEffect} from "react";
import { checkTokenAuthentication } from '../helpers/checkTokenAuthentication';

export function Login({ setIsAuthenticated }) {

    if (checkTokenAuthentication()) {
        // Si le JWT est valide, rediriger vers la page d'accueil
        return <Navigate to="/" />;
    }

    const history = useNavigate();

    useEffect(() => { document.title = 'Connexion - Models 3D'; });

    const [form, setForm] = useState({
        username: { value: '' },
        password: { value: '' },
    });

    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        const newField = { [fieldName]: { value: fieldValue } };

        setForm({ ...form, ...newField});
    }

    const validateForm = () => {
        let newForm = form;
        let regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Validator username
        if(!regexEmail.test(form.username.value)) {
            const errorMsg = 'L\'email n\'est pas valide.';
            const newField = { value: form.username.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ username: newField } };
        } else {
            const newField = { value: form.username.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ username: newField } };
        }

        // Validator password
        if(form.password.value.length < 6) {
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
                setIsAuthenticated(true);
                history('/');

            });
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                <h3 className="header center white-text">Connexion</h3>
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
                                    <label htmlFor="username">Email</label>
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