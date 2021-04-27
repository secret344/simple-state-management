import createReducerFun from "./createReduce";
import createDispatch from "./dispatch";
import setProxy from "./proxy";
import replaceReducer from "./replaceReducer";
import { AnyStore, DispatchFun } from "./types/interface";
import { isFunctionFn } from "./utils";

export const Config = {
    isDispatching: false,
    ReducerDefault: "",
};
export const store = {
    currentState: null,
    nextListeners: new Map(),
};

export function createStore<T extends AnyStore>(
    state: T,
    options?: {
        defaultKeyIndex?: number;
        enhancerDispatch?: (dispatch: DispatchFun<T>) => DispatchFun<T>;
    }
) {
    if (this.isMount) {
        throw new Error("You cannot create a repository multiple times");
    }
    if (typeof state !== "object" || state === null || isFunctionFn(state)) {
        throw new Error("Store must be an object");
    }

    let p: T = { ...state };
    let idx = 0;
    let defIndex = (options && options.defaultKeyIndex) || 0;
    let defaultKey = "";
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            if (idx === 0) {
                defaultKey = key;
            }
            if (idx === defIndex) {
                defaultKey = key;
                idx++;
                break;
            }
            idx++;
        }
    }
    if (idx === 0) {
        throw new Error("There's no data. store:" + state);
    }
    Config.ReducerDefault = defaultKey;
    store.currentState = setProxy(p) as T;
    this.isMount = true;
    function subscribe(listener: () => void, key?: string) {
        if (!isFunctionFn(listener)) {
            throw new Error("Expected the listener to be a function.");
        }
        let isSubscribed = true;
        key = key || Config.ReducerDefault;
        let nextListeners = store.nextListeners;
        let stateListeners = nextListeners.get(key);

        if (Array.isArray(stateListeners)) {
            stateListeners.push(listener);
        } else {
            store.nextListeners.set(key, [listener]);
            stateListeners = nextListeners.get(key);
        }

        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            if (Config.isDispatching) {
                throw new Error(
                    "You may not unsubscribe from a store listener while the reducer is executing."
                );
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
    let createReducer = createReducerFun<T>();
    return {
        subscribe,
        getStateCut,
        dispatch: createDispatch<T>(
            createReducer.reducersMap,
            options && options.enhancerDispatch
        ),
        createReducer: createReducer.createReducer,
        replaceReducer: replaceReducer<T, keyof T>(createReducer.reducersMap),
    };
}
