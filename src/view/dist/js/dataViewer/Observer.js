export class Observer{
    constructor() {
        this.observers = new Map();
    }
    subscribe(key,fn) {
        this.observers.set(key,fn)
    }
    unsubscribe(key) {
        this.observers = this.observers.filter(subscriber => subscriber.key !== key)
    }
    notify(key,data) {
        if(this.observers.has(key)){
            this.observers.get(key).releaseNotification(key,data);
        }
    }
}
