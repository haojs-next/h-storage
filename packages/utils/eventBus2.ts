

class EventBus2 {
    _events
    constructor () {
        this._events = Object.create(null)
    }

    on (type: string, handle: Function, context?: any) {
        const vm = this;
        if (typeof handle !== "function") {
            return vm
        } 
        const tuple = { 
            context: context || vm,
            handle
        }
        if (vm._events && vm._events[type]) {
            vm._events[type].push(tuple)
        } else {
            vm._events[type] = [tuple]
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
        
        handlers.forEach((tuple: any, index: number, list: any[]) => {
            if (handle === tuple.handle) {
                list.splice(index, 1)
            }
        })

        return vm;
    }


    emit (type: string, ...evt: any[]) {
        const vm = this;
        const handlers = vm._events[type] || [];
        
        handlers.forEach((tuple) => {
            const { context, handle } = tuple;
            handle.apply(context, evt)
        });

        return vm;
    }

}

export default EventBus2;
