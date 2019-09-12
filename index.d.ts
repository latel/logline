import { Setting } from "./types/global";

type ConfigStatic = (setting: Setting) => void;

export interface LoglineInstance {
    [x: string]: (...args: any) => Promise<undefined>;
    debug(): Promise<undefined>;
    info(): Promise<undefined>;
    warn(): Promise<undefined>;
    error(): Promise<undefined>;
}

export interface LoglineStatic extends LoglineInstance {
    new(): LoglineInstance;
    config: ConfigStatic;
    all(): any;
    get(): any;
    keep(): any;
    clean(): any;
    q: any;
    d: any;
    on(): any;
    off(): any;
    plugin(): any;
    storage(): any;
}

declare const Logline: LoglineStatic;

export default Logline;