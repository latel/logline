export enum ConsoleLevel {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

let _console = typeof window !== 'undefined' && window.console || false;

export const console = (level: ConsoleLevel, ...content: any[]) => {
    if (_console) {
        (_console as Console)[level](...content);
    }
};


export const timeDescriptorTranslate = (descriptor: TimeRangeDescriptor): number => {
    // if falsy value or timestamp already, pass it through directly,
    if (!descriptor || /^\d{13}$/.test(String(descriptor))) {
        return +descriptor;
    }

    return Date.now() - +String(descriptor).replace(/d$/, '') * 24 * 3600 * 1000;
};
