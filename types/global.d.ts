interface LogItem {
    timestamp: number;
    module: string;
    message: string;
    data: any;
}

type LogItemSet = LogItem[];

type CallbackLogItemSet = (logItems: LogItemSet) => {};
type CallbackOperationResult = (result: boolean) => {};
type CallbackOperationAffection = (count: number) => {};
type TimeRangeDescriptor = string | number;

declare enum LogLevel {
    ALL = 0,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    CRITICAL,
}

export interface Setting {
    // recording logs beyond which log level
    logLevel?: LogLevel;
    // recording logs includes certain modules, use glob style syntax,
    // has larger priority than logModuleExcludes
    logModuleIncludes?: string[];
    // recording logs excludes certain modules, use glob style syntax
    logModuleExcludes?: string[];
    // special a database name in case of duplicated as web-storage is domain shared
    database?: string;
}