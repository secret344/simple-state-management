import { emitListeners } from "./emitListeners";
import { DispatchFun, EnhancerDispatch } from "./type/dispatch";
import { Action, AnyAction, ReducerFun, ReducerFunObj } from "./type/interface";
import { AnyStore, Store } from "./type/store";
import { isFunctionFn } from "./utils";
import warning from "./utils/warning";

export function createStore<T extends AnyStore>(
    state: T,
    options?: {
        defaultKeyIndex?: number;
        enhancerDispatch?: EnhancerDispatch<T>;
    }
): Store<T> {
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
    let isDispatching = false;
    const nextListeners = new Map();
    const ReducerDefault: keyof T = defaultKey;
    const currentState = setProxy(p) as T;
    const reducersMap = new Map();
    function subscribe(listener: () => void, key?: keyof T) {
        if (!isFunctionFn(listener)) {
            throw new Error("Expected the listener to be a function.");
        }
        let isSubscribed = true;
        key = key || ReducerDefault;
        let stateListeners = nextListeners.get(key);

        if (Array.isArray(stateListeners)) {
            stateListeners.push(listener);
        } else {
            nextListeners.set(key, [listener]);
            stateListeners = nextListeners.get(key);
        }
        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            if (isDispatching) {
                throw new Error(
                    "You may not unsubscribe from a store listener while the reducer is executing."
                );
            }
            isSubscribed = false;
            const index = stateListeners.indexOf(listener);
            stateListeners.splice(index, 1);
        };
    }
    /**
     * getStateCut
     * @param key
     * @returns
     */
    function getStateCut<F extends keyof T>(key?: F): T[F] {
        let k = key || ReducerDefault;
        let curstate = currentState[k as F];
        if (typeof curstate === "undefined") {
            throw new Error("The key entered is invalid");
        }
        return curstate;
    }

    function setProxy(state) {
        const handler = {
            get: function (target: any, key: any, receiver: any) {
                const res = Reflect.get(target, key, receiver);
                if (typeof res === "object") {
                    return setProxy(res);
                }
                return res;
            },
            set: function (target: any, key: any, value: any, receiver: any) {
                if (!isDispatching) {
                    throw new Error(
                        "Do not modify the internal values of the repository externally." +
                            "all changes must be made sync"
                    );
                }
                const res = Reflect.set(target, key, value, receiver);
                return res;
            },
        };
        return new Proxy(state, handler);
    }

    /**
     * dispatch
     * @param action
     * @param storeKey
     * @returns
     */
    let dispatch: DispatchFun<keyof T> = function (
        action: AnyAction,
        storeKey?: keyof T
    ) {
        if (isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }
        let key = storeKey || ReducerDefault;

        let currentReducers = reducersMap.get(key);

        if (!currentReducers) {
            throw new Error(
                "You must call Dispatch after setting the Reducers"
            );
        }

        let curState = currentState[key];

        try {
            let state = curState;
            isDispatching = true;
            if (Array.isArray(currentReducers)) {
                currentReducers.forEach((item) => {
                    let s = item(curState as T, action);
                    if (typeof s === "object") {
                        state = Object.assign(state, s);
                    } else {
                        state = s;
                    }
                });
            } else {
                state = currentReducers(curState as T, action);
            }

            if (typeof state !== "undefined" && !isFunctionFn(state)) {
                currentState[key] = state;
            } else if (process.env.NODE_ENV !== "production") {
                warning(
                    "You must ensure that the Reducer returns the modified store"
                );
            }
        } catch (rej) {
            throw new Error(rej);
        } finally {
            isDispatching = false;
            emitListeners(nextListeners, key);
        }

        return action;
    };
    if (options && typeof options.enhancerDispatch !== "undefined") {
        if (typeof options.enhancerDispatch !== "function") {
            throw new Error(`Expected the enhancer to be a function.`);
        }
        dispatch = options.enhancerDispatch(dispatch);
    }

    /**
     * createReducerFun
     * @param reducerFun
     */
    function createReducer<K extends keyof T>(
        reducerFun: ReducerFun<T, T[K]> | ReducerFunObj<T, K>
    );
    function createReducer<K extends keyof T>(
        reducerFun: ReducerFun<T, T[K]> | Array<ReducerFun<T, T[K]>>,
        storeKey: K
    );
    function createReducer<K extends keyof T>(reducerFun, storeKey?) {
        let currentReducer:
            | ReducerFunObj<T, K>
            | Array<ReducerFun<T, T[K]>>
            | ReducerFun<T, T[K]>
            | ReducerFun<T, T[K]>[] = reducerFun;

        if (typeof storeKey !== "undefined" && typeof storeKey === "string") {
            return setReducerMap(storeKey as K);
        }

        if (typeof reducerFun === "function" || Array.isArray(reducerFun)) {
            return setReducerMap(ReducerDefault as K);
        }

        if (typeof reducerFun === "object" && reducerFun !== null) {
            for (const key in reducerFun) {
                if (Object.prototype.hasOwnProperty.call(reducerFun, key)) {
                    const s = reducerFun[key];
                    currentReducer = s;
                    setReducerMap(key as K);
                }
            }
            return;
        }

        throw new Error(
            "The type Reducers must be Object or Function or Array<Function>"
        );

        function setReducerMap(key: K) {
            let action = reducersMap.get(key);
            if (action) {
                throw new Error(
                    "You cannot set the Reducer repeatedly" +
                        "The duplicate key value is ---" +
                        key
                );
            }
            if (Array.isArray(currentReducer)) {
                let m = [];
                for (let i = 0; i < currentReducer.length; i++) {
                    const s = currentReducer[i];
                    if (process .env.NODE_ENV !== "production") {
                        let index = m.indexOf(s);
                        if (index >= 0) {
                            warning(
                                "Multiple Reducers being the same is not recommended," +
                                    "which would cause ReplacerEducer method replacement exceptions"
                            );
                        }
                    }
                    m.push(s);
                }
                currentReducer = m;
            }
            reducersMap.set(key, currentReducer);
        }
    }
    /**
     * replaceReducer
     * @param reducerFun
     * @param newReducerFun
     * @param storeKey
     */
    function replaceReducer<K extends keyof T, A extends Action = AnyAction>(
        reducerFun: ReducerFun<T, T[K], A>,
        newReducerFun: ReducerFun<T, T[K], A>,
        storeKey?: K
    ) {
        if (!isFunctionFn(newReducerFun)) {
            throw new Error("Expected the nextReducer to be a function.");
        }
        let key = storeKey || ReducerDefault;
        let reducers = reducersMap.get(key);
        if (!reducers) {
            throw new Error("You must specify a store.");
        }
        let isReplace = false;
        if (!Array.isArray(reducers)) {
            if (reducers === reducerFun) {
                isReplace = true;
                reducersMap.set(key, newReducerFun);
            }
        } else {
            let len = reducers.length;
            for (let i = 0; i < len; i++) {
                let reducer = reducers[i];
                if (reducer === reducerFun) {
                    isReplace = true;
                    reducers.splice(i, 1, newReducerFun);
                    break;
                }
            }
            reducersMap.set(key, reducers);
        }

        if (!isReplace) {
            throw new Error("The reducer to be replaced was not found");
        }
    }
    return {
        subscribe,
        getStateCut,
        dispatch,
        createReducer,
        replaceReducer,
    };
}
