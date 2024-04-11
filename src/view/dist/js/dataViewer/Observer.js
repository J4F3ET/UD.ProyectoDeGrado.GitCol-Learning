export class Observer{
    _observers = [];
    subscribe(observer){
        this._observers.push(observer);
    }
    unsubscribe(observer){
        this._observers = this._observers.filter(subscriber => subscriber !== observer);
    }
    notify(data){
        this._observers.forEach(observer => {
            observer.notify(data);
        })
    }
}
