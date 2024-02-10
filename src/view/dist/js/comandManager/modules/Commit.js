export class Commit {
    constructor() {
        this.comand = 'commit';
    }


    execute(config) {
    console.log('Commit');
    }
    /**
     * @name createCod
     * @description Crea un codigo de 7 caracteres aleatorios
     * @returns {string} Codigo de 7 caracteres aleatorios
     */
    createCod() {
        const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
        for (let i = 0; i < 7; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres.charAt(indice);
        }
        return codigo;
    }
}