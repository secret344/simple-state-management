export default function warning(message: string): void {
    /* eslint-disable no-console */
    if (typeof console !== "undefined" && typeof console.warn === "function") {
        return console.warn(message);
    }
    /* eslint-enable no-console */
    try {
        throw new Error(message);
    } catch (e) {} // eslint-disable-line no-empty
}
