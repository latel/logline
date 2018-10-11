/**
 * listen to a event
 * @param event event name to listen
 * @param handler event handler
 * @param once if event handler should only emit one time
 */
export declare const on: (event: string, handler: Function, once?: boolean) => void;
/**
 * stop listen to a event
 * @param event event name to stop listen to
 * @param handler event handler already registered, if not provieded, will remove all handlers under this event
 */
export declare const off: (event: string, handler?: Function | undefined) => void;
/**
 * trigger a event
 * @param event event name to emit
 * @param data data provided to event handlers
 */
export declare const emit: (event: string, data: any) => void;
