// A storage implemention that record logs in memory
import { Storage, SearchPattern, FiltterPattern, StorageInstalled, StorageInstance } from '../types/storage';

type MemLogItem = [ LogItem['timestamp'], LogItem['module'], LogItem['message'], LogItem['data'] ];

let storageList: StorageInstalled[] = [];
let activeStorage: StorageInstalled;

/**
 * install a new storage implements
 * @param storage storage definition
 * @param priority storage priority
 */
export const install = (storage: Storage, priority: number) => {
    (storage as StorageInstalled).__priority = priority;
    storageList.push(storage as StorageInstalled);
    // index storagies by priority
    storageList.sort((a, b) => b.__priority - a.__priority);
};

export default abstract class BaseStorage implements StorageInstance {
    constructor(protected module: string) {
    }
    abstract record(level: LogLevel, message: string, data: any): Promise<boolean>;
    async debug(message: string, data: any) {
        return await this.record(LogLevel.DEBUG, message, data);
    }
    async info(message: string, data: any) {
        return await this.record(LogLevel.INFO, message, data);
    }
    async warn(message: string, data: any) {
        return await this.record(LogLevel.WARN, message, data);
    }
    async error(message: string, data: any) {
        return await this.record(LogLevel.ERROR, message, data);
    }
    async critical(message: string, data: any) {
        return await this.record(LogLevel.CRITICAL, message, data);
    }
}

export class MemStorage extends BaseStorage {
    static database: MemLogItem[] = [];
    static async drop(): Promise<boolean> { return true; };
    static async support(): Promise<boolean> { return true; };
    static async query(): Promise<LogItemSet> { return []; };
    static async delete(): Promise<number> { return 0; };
    static async init(): Promise<boolean> { return true; };
    static async destroy(): Promise<boolean> { return true; };
    constructor(protected module: string) {
        super(module);
    }
    async record(level: LogLevel, message: string, data: any): Promise<boolean> {
        return true;
    }
}

export const getActiveStorage = () => {
    return activeStorage;
};

// @ts-ignore
install(MemStorage, 0);
