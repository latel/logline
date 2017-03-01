const HAS_CONSOLE = window.console;
const LEVEL_CONSOLE_MAP = {
    INFO: 'log',
    WARN: 'warn',
    ERROR: 'error',
    CRITICAL: 'error'
};
const LEVEL_STYLE_MAP = {
    INFO: 'color:#FFF;background:gray',
    WARN: 'color:#FFF;background:orange',
    ERROR: 'color:#FFF;background:red',
    CRITICAL: 'color:#FFF;background:black'
};

// throw out Errors, with global prefix 'Logline: ' ahead of err.message
export function throwError(errMessage) {
    throw new Error('Logline: ' + errMessage);
}

// print debug info in develper's console
// if WechatFE/vConsole is detected, will not use %c feature, as it is not well supported
export function debug(namespace, level, descriptor, data) {
    if (HAS_CONSOLE) {
        window.console[LEVEL_CONSOLE_MAP[level.toUpperCase()] || LEVEL_CONSOLE_MAP.INFO]('%c %s %s %c %s ' + (typeof data === 'object' ? '%O' : '%s'), LEVEL_STYLE_MAP[level.toUpperCase()] || LEVEL_STYLE_MAP.INFO, level, namespace, 'color:initial', descriptor, data || '');
    }
}
