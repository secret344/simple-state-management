import createReducerFun from "./createReduce";
import createDispatch from "./dispatch";
import setProxy from "./proxy";
import replaceReducer from "./replaceReducer";
import { AnyStore, DispatchFun } from "./types/interface";
import { isFunctionFn } from "./utils";

export const Config = {
    isDispatching: false,
};
export function createStore<T extends AnyStore>(
    state: T,
    options?: {
        defaultKeyIndex?: number;
        enhancerDispatch?: (dispatch: DispatchFun<T>) => DispatchFun<T>;
    }
) {
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
    this.nextListeners = new Map();
    this.ReducerDefault = defaultKey;
    this.currentState = setProxy(p) as T;
    function subscribe(listener: () => void, key?: string) {
        if (!isFunctionFn(listener)) {
            throw new Error("Expected the listener to be a function.");
        }
        let isSubscribed = true;
        key = key || this.ReducerDefault;
        let nextListeners = this.nextListeners;
        let stateListeners = nextListeners.get(key);

        if (Array.isArray(stateListeners)) {
            stateListeners.push(listener);
        } else {
            this.nextListeners.set(key, [listener]);
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
        let k = key || this.ReducerDefault;
        let currentState = this.currentState;
        if (k) {
            currentState = currentState[k];
        }
        if (typeof currentState === "undefined") {
            throw new Error("The key entered is invalid");
        }

        return currentState;
    }
    let createReducer = createReducerFun<T>();
    return {
        subscribe: subscribe.bind(this),
        getStateCut: getStateCut.bind(this),
        dispatch: createDispatch<T>(
            this,
            createReducer.reducersMap,
            options && options.enhancerDispatch
        ),
        createReducer: createReducer.createReducer.bind(this),
        replaceReducer: replaceReducer<T>(createReducer.reducersMap).bind(this),
    };
}
