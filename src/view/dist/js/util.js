// La distancia entre circulo y circulo que representa un Commit es de
// 80 hacia la derecha
// 100 hacia abajo y 100 hacia arriba
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
/**
 * @name currentHead
 * @description Returns the current head of the repository
 * @param {Object[]} storage Data of the local storage of the repository
 * @returns {JSON} Data of the current head
 */
export function currentHead(storage) {
    return storage.find(element => element.tags.includes('HEAD')); 
}
