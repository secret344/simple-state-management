import { DispatchFun } from "./type/dispatch";
import { Action, Middleware } from "./type/interface";
import compose from "./utils/compose";
import warning from "./utils/warning";

export default function applyMiddleware<T>(middleware: Middleware<T>) {
    return function (dispatch: DispatchFun<T>): DispatchFun<T> {
        let fun = dispatch;
        let middle: any = {};
        for (const key in middleware) {
            if (Object.prototype.hasOwnProperty.call(middleware, key)) {
                // Not send store state
                let mw = middleware[key];
                if (!Array.isArray(mw)) {
                    mw = [mw];
                }
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
            if (storeKey) {
                let patch = middle[storeKey];
                if (patch && typeof patch === "function") {
                    return patch(fun)(action, storeKey);
                }
            }
            return fun(action, storeKey);
        };
        return dispatch;
    };
}
