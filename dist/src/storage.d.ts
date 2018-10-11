import { Storage, StorageInstalled, StorageInstance } from '../types/storage';
declare type MemLogItem = [LogItem['timestamp'], LogItem['module'], LogItem['message'], LogItem['data']];
/**
 * install a new storage implements
 * @param storage storage definition
 * @param priority storage priority
 */
export declare const install: (storage: Storage, priority: number) => void;
export default abstract class BaseStorage implements StorageInstance {
    protected module: string;
    constructor(module: string);
    abstract record(level: LogLevel, message: string, data: any): Promise<boolean>;
    debug(message: string, data: any): Promise<boolean>;
    info(message: string, data: any): Promise<boolean>;
    warn(message: string, data: any): Promise<boolean>;
    error(message: string, data: any): Promise<boolean>;
    critical(message: string, data: any): Promise<boolean>;
}
export declare class MemStorage extends BaseStorage {
    protected module: string;
    static database: MemLogItem[];
    static drop(): Promise<boolean>;
    static support(): Promise<boolean>;
    static query(): Promise<LogItemSet>;
    static delete(): Promise<number>;
    static init(): Promise<boolean>;
    static destroy(): Promise<boolean>;
    constructor(module: string);
    record(level: LogLevel, message: string, data: any): Promise<boolean>;
}
export declare const getActiveStorage: () => StorageInstalled;
export {};
