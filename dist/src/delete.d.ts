import { SearchPattern } from "../types/storage";
/**
 * keep logs within a cetain timepoint, other logs will be removed
 * @deprecated 1.2.0
 * @param from specify a time poinit after which log will be kept, otherwise removed
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const keep: (from: TimeRangeDescriptor) => Promise<number>;
/**
 * remove all logs
 * @alias all
 * @deprecated 1.2.0
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const clean: () => Promise<number>;
/**
 * remove all logs
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const all: () => Promise<number>;
/**
 * remove logs before a certain timepoint
 * @param to target log end with which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const before: (to: TimeRangeDescriptor) => Promise<number>;
/**
 * remove logs from a certain timepoint
 * @param from target log from which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const after: (from: TimeRangeDescriptor) => Promise<number>;
/**
 * delete logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const between: (from: TimeRangeDescriptor, to: TimeRangeDescriptor) => Promise<number>;
/**
 * remove log database
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const drop: () => Promise<number>;
/**
 * removed logs that satisfies given search pattern
 * @param search search pattern
 * @returns numbers of logs deleted, -1 indicates that an error has occured
 */
export declare const filter: (search: SearchPattern) => Promise<number>;
