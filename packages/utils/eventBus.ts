

class EventBus {
    _events
    constructor () {
        this._events = Object.create(null)
    }

    on (type: string, handle: Function) {
        const vm = this;
        if (typeof handle !== "function") {
            return vm
        } 
        if (vm._events && vm._events[type]) {
            vm._events[type].push(handle)
        } else {
            vm._events[type] = [handle]
        }
        return vm;
    }

    off (type: string, handle: Function) {
        const vm = this;
        if (!vm._events[type]) {
           return vm;
        }
        if (!handle) {
            vm._events[type] = null
            return vm
        }


        let handlers = vm._events[type];
        
        handlers.forEach((fn: Function, index: number, list: any[]) => {
            if (handle === fn) {
                list.splice(index, 1)
            }
        })

        return vm;
    }


    emit (type: string, ...evt: any[]) {
        const vm = this;
        const handlers = vm._events[type] || [];
        
        handlers.forEach((fn: Function) => {
            fn(...evt)
        });

        return vm;
    }

}

export default EventBus;
