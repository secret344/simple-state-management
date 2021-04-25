import { createReducerFun } from "./createReduce";
import { createDispatch } from "./dispatch";
import setProxy from "./proxy";
import { replaceReducer } from "./replaceReducer";
import { AnyObj, DispatchFun, Middleware } from "./types/listener_type";
export const Config = {
    isDispatching: false,
    ReducerDefault: "default",
    isMount: false,
};
export const store = {
    currentState: null,
    nextListeners: new Map(),
};

export function createStore<T extends AnyObj>(
    state: T,
    options?: {
        defaultKeyIndex: 0;
        enhancerDispatch: (dispatch: DispatchFun<T>) => DispatchFun<T>;
    }
) {
    if (Config.isMount) {
        throw new Error("You cannot create a repository multiple times");
    }
    if (typeof state !== "object" || typeof state === null) {
        throw new Error("Store must be an object");
    }
    let p: T = state;
    let idx = 0;
    let defIndex = (options && options.defaultKeyIndex) || 0;
    let defaultKey = "";
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            if (idx === 0) {
                defaultKey = key;
            }
            if (idx === defIndex) {
                Config.ReducerDefault = key;
                break;
            }
            idx++;
        }
    }
    defIndex > idx && (Config.ReducerDefault = defaultKey);
    store.currentState = setProxy(p) as T;
    Config.isMount = true;
    function subscribe(listener: () => void, key?: string) {
        let isSubscribed = true;
        key = key || Config.ReducerDefault;
        let nextListeners = store.nextListeners;
        let stateListeners = nextListeners.get(key);

        if (Array.isArray(stateListeners)) {
            stateListeners.push(listener);
        } else {
            store.nextListeners.set(key, [listener]);
        }

        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            if (Config.isDispatching) {
                throw new Error("");
            }
            isSubscribed = false;
            const index = stateListeners.indexOf(listener);
            stateListeners.splice(index, 1);
        };
    }

    function getStateCut<F extends keyof T>(key?: F): T[F] {
        key = key || (Config.ReducerDefault as F);
        let currentState = store.currentState;
        if (key) {
            currentState = currentState[key];
        }
        if (typeof currentState === "undefined") {
            throw new Error("The key entered is invalid");
        }
        return currentState;
    }
    return {
        subscribe,
        getStateCut,
        dispatch: createDispatch<T>(options.enhancerDispatch),
        createReducer: createReducerFun<T, keyof T>(),
        replaceReducer: replaceReducer<T, keyof T>(),
    };
}
