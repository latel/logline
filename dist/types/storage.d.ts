interface SearchPatternObj {
    module?: string;
    message?: string;
    data?: any;
    from?: number;
    to?: number;
}
export declare type SearchPattern = string | SearchPatternObj;
export declare type FiltterPattern = SearchPattern;
export interface StorageInstance {
    record: (level: LogLevel, message: string, data: any) => Promise<boolean>;
    debug: (message: string, data: any) => Promise<boolean>;
    info: (message: string, data: any) => Promise<boolean>;
    warn: (message: string, data: any) => Promise<boolean>;
    error: (message: string, data: any) => Promise<boolean>;
    critical: (message: string, data: any) => Promise<boolean>;
}
export interface Storage {
    new (): StorageInstance;
    init: () => Promise<boolean>;
    support: () => Promise<boolean>;
    drop: () => Promise<boolean>;
    query: (search?: SearchPattern) => Promise<LogItemSet>;
    delete: (filter?: FiltterPattern) => Promise<number>;
}
export interface StorageInstalled extends Storage {
    __priority: number;
}
export {};
