import { reducersMap } from "./createReduce";
import { Config, store } from "./createStore";
import warning, { Action, DispatchFun } from "./types/listener_type";
export function createDispatch<T>(
    enhancer?: (dispatch: DispatchFun<T>) => DispatchFun<T>
) {
    let dispatch = function (action: Action, storeKey?: keyof T) {
        if (Config.isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }
        let key = storeKey || Config.ReducerDefault;
        let currentReducers = reducersMap.get(key);

        if (!currentReducers) {
            throw new Error(
                "You must call Dispatch after setting the Reducers"
            );
        }
        let currentState = store.currentState[key];

        try {
            let state;
            Config.isDispatching = true;
            if (Array.isArray(currentReducers)) {
                state = currentReducers.map((item) =>
                    item(currentState as T, action)
                );
            } else {
                state = currentReducers(currentState as T, action);
            }

            if (typeof state !== "undefined") {
                store.currentState[key] = state;
            } else if (process.env.NODE_ENV !== "production") {
                warning(
                    "You must ensure that the Reducer returns the modified store"
                );
            }

            Config.isDispatching = false;
        } catch (rej) {
            throw new Error(rej);
        } finally {
            emitListeners(key);
        }

        return action;
    };
    if (typeof enhancer !== "undefined") {
        if (typeof enhancer !== "function") {
            throw new Error(`Expected the enhancer to be a function.`);
        }
        return enhancer(dispatch);
    }
    return dispatch;
}

export function emitListeners<T>(storeKey: T) {
    const listeners = store.nextListeners.get(storeKey) || [];
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
    }
}
