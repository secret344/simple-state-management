import { reducersMap } from "./createReduce";
import { Config } from "./createStore";
import { ReducerFun } from "./types/listener_type";

export function replaceReducer<T, F extends keyof T>() {
    return function (
        reducerFun: ReducerFun<T, F>,
        newReducerFun: ReducerFun<T, F>,
        storeKey?: F
    ) {
        let key = storeKey || Config.ReducerDefault;
        let reducers = reducersMap.get(key);
        if (!reducers) {
            throw new Error("You must specify a store");
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
