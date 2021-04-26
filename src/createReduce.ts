import { Config } from "./createStore";
import { ReducerFunObj, ReducerFun } from "./types/interface";
import warning from "./utils/warning";

export default function createReducerFun<T>() {
    const reducersMap = new Map();

    function createReducer<K extends keyof T>(
        reducerFun: ReducerFun<T, K> | ReducerFunObj<T, K>
    );
    function createReducer<K extends keyof T>(
        reducerFun: ReducerFun<T, K> | Array<ReducerFun<T, K>>,
        storeKey: K
    );
    function createReducer<K extends keyof T>(
        reducerFun:
            | ReducerFunObj<T, K>
            | ReducerFun<T, K>
            | Array<ReducerFun<T, K>>,
        storeKey?: K
    ) {
        let currentReducer:
            | ReducerFunObj<T, K>
            | Array<ReducerFun<T, K>>
            | ReducerFun<T, K>
            | ReducerFun<T, K>[] = reducerFun;

        if (!!storeKey) {
            return setReducerMap(storeKey as string);
        }

        if (typeof reducerFun === "function") {
            return setReducerMap(Config.ReducerDefault);
        }

        if (typeof reducerFun === "object" && reducerFun !== null) {
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
    return { createReducer, reducersMap };
}
