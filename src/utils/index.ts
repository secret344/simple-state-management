export function isFunctionFn(fn) {
    return (
        Object.prototype.toString.call(fn) == "[object Function]" ||
        typeof fn == "function"
    );
}
