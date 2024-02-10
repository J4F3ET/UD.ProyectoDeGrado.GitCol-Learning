// La distancia entre circulo y circulo que representa un Commit es de
// 80 hacia la derecha
// 100 hacia abajo y 100 hacia arriba
        /**
     * @name lastCommit
     * @description Retorna el ultimo commit que se creo
     * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
     */
    export function lastCommit() {
        const ultimo = document.querySelectorAll("circle");
        return ultimo[ultimo.length - 1];
    }