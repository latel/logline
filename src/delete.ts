import { timeDescriptorTranslate } from "./utils";
import { getActiveStorage } from './storage';
import { SearchPattern } from "../types/storage";

/**
 * keep logs within a cetain timepoint, other logs will be removed
 * @deprecated 1.2.0
 * @param from specify a time poinit after which log will be kept, otherwise removed
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const keep = async (from: TimeRangeDescriptor): Promise<number> => {
    return 0;
}

/**
 * remove all logs
 * @alias all
 * @deprecated 1.2.0
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const clean = async (): Promise<number> => {
    return await all();
};

/**
 * remove all logs
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const all = async (): Promise<number> => {
    let storage = getActiveStorage();
    await storage.delete();
    return 0;
};

/**
 * remove logs before a certain timepoint
 * @param to target log end with which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const before = async (to: TimeRangeDescriptor): Promise<number> => {
    let storage = getActiveStorage();
    await storage.delete({
        to: timeDescriptorTranslate(to),
    });
    return 0;
};

/**
 * remove logs from a certain timepoint
 * @param from target log from which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const after = async (from: TimeRangeDescriptor): Promise<number> => {
    let storage = getActiveStorage();
    await storage.delete({
        from: timeDescriptorTranslate(from),
    });
    return 0;
};

/**
 * delete logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const between = async (from: TimeRangeDescriptor, to: TimeRangeDescriptor): Promise<number> => {
    let storage = getActiveStorage();
    await storage.delete({
        from: timeDescriptorTranslate(from),
        to: timeDescriptorTranslate(to),
    });
    return 0;
};

/**
 * remove log database
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const drop = async (): Promise<number> => {
    let storage = getActiveStorage();
    await storage.drop();
    return 0;
};

/**
 * removed logs that satisfies given search pattern
 * @param search search pattern
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export const filter = async (search: SearchPattern): Promise<number> => {
    let storage = getActiveStorage();
    await storage.delete(search);
    return 0;
};
