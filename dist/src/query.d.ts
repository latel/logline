import { SearchPattern } from "../types/storage";
/**
 * query all logs
 */
export declare const all: () => Promise<LogItem[]>;
/**
 * query logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 */
declare function get(from: TimeRangeDescriptor, to: TimeRangeDescriptor): Promise<LogItemSet>;
declare function get(from: TimeRangeDescriptor): Promise<LogItemSet>;
export { get };
export declare const before: (to: TimeRangeDescriptor) => Promise<LogItem[]>;
export declare const after: (from: TimeRangeDescriptor) => Promise<LogItem[]>;
export declare const between: (from: TimeRangeDescriptor, to: TimeRangeDescriptor) => Promise<LogItem[]>;
export declare const filter: (search: SearchPattern) => Promise<LogItem[]>;
