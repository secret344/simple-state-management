export function emitListeners<T>(nextListeners, storeKey: T) {
    const listeners = nextListeners.get(storeKey) || [];
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
    }
}
