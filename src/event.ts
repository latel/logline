interface EventHandler extends Function {
    __once: boolean;
}

interface EventsMap {
    [x: string]: EventHandler[];
}

let eventsMaps: EventsMap = {};

/**
 * get handlers for the current event
 * @param event event name
 */
const getEventMap = (event: string): EventHandler[] => {
    return eventsMaps[event] = eventsMaps[event] || [];
};

/**
 * listen to a event
 * @param event event name to listen
 * @param handler event handler
 * @param once if event handler should only emit one time
 */
export const on = (event: string, handler: Function, once: boolean = false) => {
    let map = getEventMap(event);
    (handler as EventHandler).__once = once;
    map.push(handler as EventHandler);
};

/**
 * stop listen to a event
 * @param event event name to stop listen to
 * @param handler event handler already registered, if not provieded, will remove all handlers under this event
 */
export const off = (event: string, handler?: Function) => {
    let map = getEventMap(event);
    if (!handler) {
        map = [];
        return;
    } else {
        map = map.filter(fn => handler !== fn);
    }
};

/**
 * trigger a event
 * @param event event name to emit
 * @param data data provided to event handlers
 */
export const emit = (event: string, data: any) => {
    let map = getEventMap(event);
    for (let handler of map) {
        handler(data);
    }
    // remove once handlers
    map = map.filter(handler => handler.__once);
};
