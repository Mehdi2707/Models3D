export default class FilesService {

    static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

    static deleteFile(id, slug) {
        if(this.isDev) {
            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/api/files/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({slug})
            })
            .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const { id } = pokemon;
            this.pokemons = this.pokemons.filter(pokemon => pokemon.id !== id);
            resolve({});
        });
    }

    static handleError(error) {
        console.error(error);
    }
}