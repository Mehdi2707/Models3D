export default class ModelsService {

    static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

    static getModels() {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch('http://localhost:8000/api/models', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            resolve(this.pokemons);
        });
    }

    static getModel(id) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/models/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            return null;
                        }
                    }
                    return response.json();
                })
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            resolve(this.pokemons.find(pokemon => id == pokemon.id));
        });
    }

    static updateModel(model) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/models/${model.id}`, {
                method: 'PUT',
                body: JSON.stringify(model),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                // .then(response => response.json())
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const { id } = pokemon;
            const index = this.pokemons.findIndex(pokemon => pokemon.id === id);
            this.pokemons[index] = pokemon;
            resolve(pokemon);
        });
    }

    static deleteModel(model) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/models/${model.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                // .then(response => response.json())
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const { id } = pokemon;
            this.pokemons = this.pokemons.filter(pokemon => pokemon.id !== id);
            resolve({});
        });
    }

    static addModel(model) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/models`, {
                method: 'POST',
                body: JSON.stringify(model),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            this.pokemons.push(pokemon);
            resolve(pokemon);
        });
    }

    static searchModel(term) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/models?q=${term}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const results = this.pokemons.filter(pokemon => pokemon.name.includes(term));
            resolve(results);
        });

    }

    static handleError(error) {alert(error)
        console.error(error);
    }
}