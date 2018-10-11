export declare enum ConsoleLevel {
    LOG = "log",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export declare const console: (level: ConsoleLevel, ...content: any[]) => void;
export declare const timeDescriptorTranslate: (descriptor: TimeRangeDescriptor) => number;
