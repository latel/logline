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

interface Setting {
    // record logs beyond which log level
    logLevel: LogLevel;
    // record logs within certain modules, use glob style matches
    logModule: string[];
    // special a database name incase duplicated as web-storage is domain shared
    database: string;
}

interface SettingPartial {
    logLevel?: LogLevel;
    logModule?: string[];
    database?: string;
}
