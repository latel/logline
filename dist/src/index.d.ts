import * as q from './query';
import * as d from './delete';
import { on, off } from './event';
import { install as installPlugin } from './plugin';
import { install as installStorage } from './storage';
export declare const config: (setting: Setting) => void;
export { q, d };
/**
 * query all logs
 * @deprecated 1.2.0
 * @param cb callback with logs retrived
 */
export declare const all: (cb: CallbackLogItemSet) => void;
/**
 * query logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 * @param cb callback with logs retrived
 */
export declare const get: (from: TimeRangeDescriptor, to: TimeRangeDescriptor, cb: CallbackLogItemSet) => void;
/**
 * keep logs within certain period
 * @param from specify a time poinit after which log will be kept, otherwise removed
 * @param cb callback when other logs are removed
 */
export declare const keep: (from: TimeRangeDescriptor, cb: CallbackOperationAffection) => void;
/**
 * remove all logs and delete log database
 * @param cb callback when log database is cleaned
 */
export declare const clean: (cb: CallbackOperationAffection) => void;
export { on, off };
export { installPlugin as plugin };
export { installStorage as storage };
