import { Config } from "./createStore";
import { Action, DispatchFun, Middleware } from "./types/interface";
import compose from "./utils/compose";
import warning from "./utils/warning";

export default function applyMiddleware<T>(middleware: Middleware<T>) {
    return function (dispatch: DispatchFun<T>): DispatchFun<T> {
        let fun = dispatch;
        let middle: any = {};
        for (const key in middleware) {
            if (Object.prototype.hasOwnProperty.call(middleware, key)) {
                // Not store state
                const mw = middleware[key];
                middle[key] = compose(...mw);
                if (
                    process.env.NODE_ENV !== "production" &&
                    typeof middle[key] !== "function"
                ) {
                    warning(
                        "Middleware must be a function,Otherwise the default dispatch will be invoked."
                    );
                }
            }
        }

        dispatch = (action: Action, storeKey?: keyof T) => {
            let key = storeKey || (Config.ReducerDefault as keyof T);
            let patch = middle[key];

            if (typeof patch === "function") {
                return patch(fun)(action, key);
            }
            return fun(action, storeKey);
        };
        return dispatch;
    };
}
