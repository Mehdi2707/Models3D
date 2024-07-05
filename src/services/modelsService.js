export default class ModelsService {

    static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

    static getModels(page) {
        if(this.isDev) {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:8000/api/models?limit=8';
            
            if(page)
                url += '&page=' + page;

            return fetch(url, {
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

            const formData = new FormData();
            formData.append('title', model.title);
            formData.append('description', model.description);
            model.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
            model.files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
            model.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag.name);
            });

            return fetch(`http://localhost:8000/api/models/${model.id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
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

            const formData = new FormData();
            formData.append('title', model.title);
            formData.append('description', model.description);
            model.files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
            model.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
            model.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag.name);
            });

            return fetch(`http://localhost:8000/api/models`, {
                method: 'POST',
                body: formData,
                headers: {
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

            return fetch(`http://localhost:8000/api/models?limit=10&term=${term}`, {
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

    static getModelTag(tag, page) {
        if(this.isDev) {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:8000/api/models?limit=10';

            if(page)
                url += '&page=' + page;

            url += '&tag=' + tag;

            return fetch(url, {
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

    static handleError(error) {
        console.error(error);
    }
}