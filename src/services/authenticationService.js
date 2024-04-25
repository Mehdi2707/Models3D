export default class AuthenticationService {

    static login(username, password) {

        return fetch(`http://localhost:8000/api/login_check`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: { 'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Erreur lors de l\'authentification : ', error));
    }

    static register(email, password) {

        return fetch(`http://localhost:8000/api/users`, {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: { 'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Erreur lors de l\'inscription : ', error));
    }
}