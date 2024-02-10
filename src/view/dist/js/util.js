// La distancia entre circulo y circulo que representa un Commit es de
// 80 hacia la derecha
// 100 hacia abajo y 100 hacia arriba
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

    /**
 * @name lastCommit
 * @description Retorna el ultimo commit que se creo
 * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
 */
export function lastCommit() {
    const ultimo = document.querySelectorAll("circle");
    return ultimo[ultimo.length - 1];
}
/**
 * @name currentHead
 * @description Returns the current head of the repository
 * @param {JSON} storage Data of the local storage of the repository
 * @returns {JSON} Data of the current head
 */
export function currentHead(storage) {
    if(isEmptyObject(storage))
        return {
            id: "e137e9b",
            parent: "e137e9b",
            message: "First commit",
            tags: ["master", "HEAD"],
            cx: 140,
            cy: 360,
        };
    return storage.array.find(element => {element.tags.includes('HEAD');});

}
