import { Config } from "./createStore";
import { ReducerFun } from "./types/interface";
import { isFunctionFn } from "./utils";

export default function replaceReducer<T>(reducersMap: Map<any, any>) {
    return function <K extends keyof T>(
        reducerFun: ReducerFun<T, T[K]>,
        newReducerFun: ReducerFun<T, T[K]>,
        storeKey?: K
    ) {
        if (!isFunctionFn(newReducerFun)) {
            throw new Error("Expected the nextReducer to be a function.");
        }
        let key = storeKey || Config.ReducerDefault;
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
    };
}
