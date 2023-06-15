export class Observer<Sub = any, NData = any> {
	private _subscribers: { id: string; sub: Sub }[]
	private _notifyFn: (sub: Sub, data: NData) => void
	constructor(
		notifyFn: (sub: Sub, data: NData) => void,
		subs?: { id: string; sub: Sub }[]
	) {
		this._subscribers = subs ? subs : []
		this._notifyFn = notifyFn 
	}

	subscribe(newSubscriber: { id: string; sub: Sub }) {
		this._subscribers.push(newSubscriber)
        return this
	}

	unsubscribe(id: string) {
		this._subscribers = this._subscribers.filter(sub => sub.id !== id)
        return this
	}

	notify(id: string, data: NData) {
		const listener = this._subscribers.find(sub => sub.id === id)

        if (!listener) {
            throw new Error(`Listener with id ${id} does not exists`)
        }

        this._notifyFn(listener.sub, data)
        return this
	}

    notifyAll(data: NData) {
        this._subscribers.forEach(sub => this._notifyFn(sub.sub, data))
        return this
    }

	set notifyFn(fn: (sub: Sub, data: NData) => void) {
		this._notifyFn = fn
	}
}