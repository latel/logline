interface SearchPatternObj {
    module?: string;
    message?: string;
    data?: any;
    from?: number;
    to?: number;
}
export type SearchPattern = string | SearchPatternObj;
export type FiltterPattern = SearchPattern;

export interface StorageInstance {
    // add a new log record
    record: (level: LogLevel, message: string, data: any) => Promise<boolean>;
    // add a new debug log record
    debug: (message: string, data: any) => Promise<boolean>;
    // add a new info log record
    info: (message: string, data: any) => Promise<boolean>;
    // add a new warn log record
    warn: (message: string, data: any) => Promise<boolean>;
    // add a new error log record
    error: (message: string, data: any) => Promise<boolean>;
    // add a new critical log record
    critical: (message: string, data: any) => Promise<boolean>;
}

export interface Storage {
    // create a storage instance with namespace
    new(): StorageInstance;
    // initialize this storage
    init: () => Promise<boolean>;
    // whether this storage is supported in the current environment
    support: () => Promise<boolean>;
    // destroy this storage, remove all logs and delete database
    drop: () => Promise<boolean>;
    // query logs with search pattern and returns log item set
    query: (search?: SearchPattern) => Promise<LogItemSet>;
    // delete logs with filter pattern and returns the number of logs affected
    delete: (filter?: FiltterPattern) => Promise<number>;
}

export interface StorageInstalled extends Storage {
    __priority: number;
}
