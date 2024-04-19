export default class Model {
    // 1. Typage des propiétés d'un pokémon.
    title: string;
    description: string;
    images: Array<string>;
    files: Array<string>;
    tags: Array<string>;

    // 2. Définition des valeurs par défaut des propriétés d'un pokémon.
    constructor(
        title: string = "titre",
        description: string = 'description',
        images: Array<string> = ['Image'],
        files: Array<string> = ['Fichier'],
        tags: Array<string> = ['Tag']
    ) {
        // 3. Initialisation des propiétés d'un pokémons.
        this.title = title;
        this.description = description;
        this.images = images;
        this.files = files;
        this.tags = tags;
    }
}