export function displayError(errMsg) {
    if (window.console && window.console.error) {
        window.console.error('logline: ' + errMsg);
    }
}
