import { Config } from "./createStore";
import warning, { ReducerFunObj, ReducerFun } from "./types/listener_type";

export const reducersMap = new Map();

export function createReducerFun<T, F extends keyof T>() {
    function createReducer(reducerFun: ReducerFunObj<T, F>);
    function createReducer(
        reducerFun: ReducerFun<T, F> | Array<ReducerFun<T, F>>,
        storeKey: F
    );
    function createReducer(
        reducerFun:
            | ReducerFunObj<T, F>
            | ReducerFun<T, F>
            | Array<ReducerFun<T, F>>,
        storeKey?: F
    ) {
        let currentReducer:
            | ReducerFunObj<T, F>
            | Array<ReducerFun<T, F>>
            | ReducerFun<T, F>
            | ReducerFun<T, F>[] = reducerFun;

        if (!!storeKey) {
            return setReducerMap(storeKey as string);
        }

        if (typeof reducerFun === "function") {
            return setReducerMap(Config.ReducerDefault);
        }

        if (typeof reducerFun === "object") {
            for (const key in reducerFun) {
                if (Object.prototype.hasOwnProperty.call(reducerFun, key)) {
                    const s = reducerFun[key];
                    currentReducer = s;
                    setReducerMap(key);
                }
            }
            return;
        }

        throw new Error(
            "The type Reducers must be Object or Function or Array<Function>"
        );

        function setReducerMap(key: string) {
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
                    if (process.env.NODE_ENV !== "production") {
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
    return createReducer;
}
