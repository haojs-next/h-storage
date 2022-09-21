type EventNames = string;



let has = Object.prototype.hasOwnProperty,
    prefix: string | boolean = "~";

function Events() {}

if (Object.create) {
    Events.prototype = Object.create(null);

    if (!new (Events as any)().__proto__) prefix = false;
}

function EE(this: any, fn: Function, context: any, once?: boolean) {
    const self = this;
    self.fn = fn;
    self.context = context;
    self.once = once || false;
}

function addListener(emitter: any, event: EventNames, fn: Function, context: any, once: boolean) {
    if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
    }

    let listener = new (EE as any)(fn, context || emitter, once),
        evt = prefix ? prefix + event : event;

    if (!emitter._events[evt]) (emitter._events[evt] = listener), emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [emitter._events[evt], listener];

    return emitter;
}

function clearEvent(emitter: any, evt: string) {
    if (--emitter._eventsCount === 0) emitter._events = new (Events as any)();
    else delete emitter._events[evt];
}

function EventEmitter(this: any) {
    this._events = new (Events as any)();
    this._eventsCount = 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
    let names: any[] = [],
        events;

    if (this._eventsCount === 0) return names;

    for (let name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }

    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }

    return names;
};

EventEmitter.prototype.listener = function listener(event: EventNames) {
    let evt = prefix ? prefix + event : event,
        handlers = this._events[evt];

    if (!handlers) return [];
    if (handlers.fn) return [handlers.fn];

    let l = handlers.length,
        ee = new Array(l);

    for (let i = 0; i < l; i++) {
        ee[i] = handlers[i].fn;
    }

    return ee;
};

EventEmitter.prototype.listenerCount = function listenerCount(event: EventNames) {
    let evt = prefix ? prefix + event : event,
        listeners = this._events[evt];

    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};


EventEmitter.prototype.emit = function emit(event: EventNames, a1: any, a2: any, a3: any, a4: any, a5: any) {
    let evt = prefix ? prefix + event : event;

    if (!this._events[evt]) return false


    let listener = this._events[evt],
        len = arguments.length
        , args
        , i;

    if (listener.fn) {
        if (listener.once) this.removeListener(event, listener.fn, undefined, true)

        switch (len) {
            case 1: return listener.fn.call(listener.context), true;
            case 2: return listener.fn.call(listener.context, a1), true;
            case 3: return listener.fn.call(listener.context, a1, a2), true;
            case 4: return listener.fn.call(listener.context, a1, a2, a3), true;
            case 5: return listener.fn.call(listener.context, a1, a2, a3, a4), true;
            case 6: return listener.fn.call(listener.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len - 1); i < len; i ++) {
            args[i - 1] = arguments[i]
        }

        listener.fn.apply(listener.context, args);
    } else {

        let length = listener.length,
            j;
        
        for (i = 0; i<length;i++) {
            if (listener[i].once) this.removeListener(event, listener[i].fn, undefined, true)


            switch (len) {
                case 1: listener[i].fn.call(listener[i].context); break;
                case 2: listener[i].fn.call(listener[i].context, a1); break;
                case 3: listener[i].fn.call(listener[i].context, a1, a2); break;
                case 4: listener[i].fn.call(listener[i].context, a1, a2, a3); break;
                default:
                  if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                    args[j - 1] = arguments[j];
                  }
        
                  listener[i].fn.apply(listener[i].context, args);
            }
        }
    }

    return true;
}


EventEmitter.prototype.on = function on(event: EventNames, fn: Function, context?: any) {
    return addListener(this, event, fn, context, false)
}


EventEmitter.prototype.once = function once(event: EventNames, fn: Function, context?: any) {
    return addListener(this, event, fn, context, true)
}


EventEmitter.prototype.removeListener  = function removeListener (event: EventNames, fn: Function, context: any, once: boolean) {
    let evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }

    let listener = this._events[evt];

    if (listener.fn) {
        if (listener.fn === fn && (!once || listener.once) && (!context || listener.context === context)) {
            clearEvent(this, evt)
        }
    } else {
        let events: any[] = [], length = listener.length, i;
        for (i = 0; i < length; i++) {
            if (listener[i].fn !== fn || (once || !listener[i].once) || (context || listener.context !== context)) {
                events.push(listener[i])
            }
        }

        if (Events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt)
    }
    return this;
}



EventEmitter.prototype.removeAllListeners = function removeAllListeners(event: EventNames) {
    var evt;
  
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt]) clearEvent(this, evt);
    } else {
      this._events = new (Events as any)();
      this._eventsCount = 0;
    }
  
    return this;
};


EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;


EventEmitter.prefix = prefix;

EventEmitter.EventEmitter = EventEmitter;


export default EventEmitter;
