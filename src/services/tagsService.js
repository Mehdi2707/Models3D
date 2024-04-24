export default class TagsService {

    static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

    static searchTag(term) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/tags?term=${term}`, {
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