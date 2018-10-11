import { timeDescriptorTranslate } from "./utils";
import { getActiveStorage } from "./storage";
import { SearchPattern } from "../types/storage";

/**
 * query all logs
 */
export const all = async (): Promise<LogItemSet> => {
    let storage = getActiveStorage();
    await storage.query();
    return [];
}

/**
 * query logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 */
async function get(from: TimeRangeDescriptor, to: TimeRangeDescriptor): Promise<LogItemSet>;
async function get(from: TimeRangeDescriptor): Promise<LogItemSet>;
async function get(...args: any[]): Promise<LogItemSet> {
    let storage = getActiveStorage();
    switch (args.length) {
        case 2:
            await storage.query({
                from: timeDescriptorTranslate(args[0]),
                to: timeDescriptorTranslate(args[1])
            }).then((logItemSet: LogItemSet) => args[2](logItemSet));
            return [];
            break;
        case 1:
            await storage.query({
                from: timeDescriptorTranslate(args[0]),
                to: Date.now()
            }).then((logItemSet: LogItemSet) => args[1](logItemSet));
            return [];
            break;
        default:
            return [];
            break;
    }
};

export { get };


export const before = async (to: TimeRangeDescriptor): Promise<LogItemSet> => {
    let storage = getActiveStorage();
    await storage.query({
        to: timeDescriptorTranslate(to),
    });
    return [];
};

export const after = async (from: TimeRangeDescriptor): Promise<LogItemSet> => {
    let storage = getActiveStorage();
    await storage.query({
        from: timeDescriptorTranslate(from),
    });
    return [];
};

export const between = async (from: TimeRangeDescriptor, to: TimeRangeDescriptor): Promise<LogItemSet> => {
    let storage = getActiveStorage();
    await storage.query({
        from: timeDescriptorTranslate(from),
        to: timeDescriptorTranslate(to),
    });
    return [];
};

export const filter = async (search: SearchPattern): Promise<LogItemSet> => {
    let storage = getActiveStorage();
    await storage.query(search);
    return [];
};
