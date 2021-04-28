import { DispatchFun, EnhancerDispatch } from "./types/dispatch";
import { AnyAction } from "./types/interface";
import { isFunctionFn } from "./utils";
import warning from "./utils/warning";
function createDispatch<T>(
    _this,
    reducersMap: Map<any, any>,
    enhancer?: EnhancerDispatch<T>
) {
    let dispatch: DispatchFun<T> = function (
        action: AnyAction,
        storeKey?: keyof T
    ) {
        if (_this.isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }
        let key = storeKey || _this.ReducerDefault;

        let currentReducers = reducersMap.get(key);

        if (!currentReducers) {
            throw new Error(
                "You must call Dispatch after setting the Reducers"
            );
        }

        let currentState = _this.currentState[key];

        try {
            let state = currentState;
            _this.isDispatching = true;
            if (Array.isArray(currentReducers)) {
                currentReducers.forEach((item) => {
                    let s = item(currentState as T, action);
                    if (typeof s === "object") {
                        state = Object.assign(state, s);
                    } else {
                        state = s;
                    }
                });
            } else {
                state = currentReducers(currentState as T, action);
            }

            if (typeof state !== "undefined" && !isFunctionFn(state)) {
                _this.currentState[key] = state;
            } else if (process.env.NODE_ENV !== "production") {
                warning(
                    "You must ensure that the Reducer returns the modified store"
                );
            }
        } catch (rej) {
            throw new Error(rej);
        } finally {
            _this.isDispatching = false;
            emitListeners.call(_this, key);
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

function emitListeners<T>(storeKey: T) {
    const listeners = this.nextListeners.get(storeKey) || [];
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
    }
}

export default createDispatch;
