import * as q from './query';
import * as d from './delete';
import { on, off } from './event';
import { install as installPlugin } from './plugin';
import { install as installStorage } from './storage';
import { console, ConsoleLevel } from './utils';
import { update } from './config';

// config logline
export const config = (setting: Setting) => update(setting);

// export query and delete API
export { q, d };
// export deprecated query API, will be removed in the next major release
/**
 * query all logs
 * @deprecated 1.2.0
 * @param cb callback with logs retrived
 */
export const all = (cb: CallbackLogItemSet) => {
    console(ConsoleLevel.WARN, 'all() is deprecated since v1.2.0, please use .q instead');
    q.all().then((logItemSet: LogItemSet) => cb(logItemSet));
};
/**
 * query logs within a certain time range
 * @param from target log from which time
 * @param to target log end with which time
 * @param cb callback with logs retrived
 */
export const get = (from: TimeRangeDescriptor, to: TimeRangeDescriptor, cb: CallbackLogItemSet) => {
    console(ConsoleLevel.WARN, 'get() is deprecated since v1.2.0, please use .q instead');
    q.get(from, to).then((logItemSet: LogItemSet) => cb(logItemSet));
};
// export deprecated delete API, will be removed in the next major release
/**
 * keep logs within certain period
 * @param from specify a time poinit after which log will be kept, otherwise removed
 * @param cb callback when other logs are removed
 */
export const keep = (from: TimeRangeDescriptor, cb: CallbackOperationAffection) => {
    console(ConsoleLevel.WARN, 'keep() is deprecated since v1.2.0, please use .d instead');
    d.after(from).then((deletedLogsCount: number) => cb(deletedLogsCount));
};
/**
 * remove all logs and delete log database
 * @param cb callback when log database is cleaned
 */
export const clean = (cb: CallbackOperationAffection) => {
    console(ConsoleLevel.WARN, 'clean() is deprecated since v1.2.0, please use .d instead');
    d.clean().then((deletedLogsCount: number) => cb(deletedLogsCount));
};
// export event handling
export { on, off };

// export plugin install
export { installPlugin as plugin };
// export storage install
export { installStorage as storage };

// export local type definitions
