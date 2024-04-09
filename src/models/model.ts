export default class Model {
    // 1. Typage des propiétés d'un pokémon.
    // id: number;
    title: string;
    description: string;
    file: string;
    // slug: string;
    // images: Array<string>;
    // createdAt: Date;

    // 2. Définition des valeurs par défaut des propriétés d'un pokémon.
    constructor(
        // id: number,
        title: string = "titre",
        description: string = 'description',
        file: string = 'fichier',
        // slug: string = 'slug',
        // images: Array<string> = ['Image'],
        // createdAt: Date = new Date()
    ) {
        // 3. Initialisation des propiétés d'un pokémons.
        // this.id = id;
        this.title = title;
        this.description = description;
        this.file = file;
        // this.slug = slug;
        // this.images = images;
        // this.createdAt = createdAt;
    }
}