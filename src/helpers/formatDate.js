export const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Ajouter 1 car getMonth() retourne les mois de 0 à 11
    const year = dateObject.getFullYear();

    // Ajouter un zéro avant le jour et le mois si nécessaire pour garantir un format à deux chiffres
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
}
