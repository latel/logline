// throw out Errors, with global prefix 'Logline: ' ahead of err.message
export function throwError(errMessage) {
    throw new Error('Logline: ' + errMessage);
}
