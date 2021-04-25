export type AnyObj = { [key in string]: any };
export interface Action<T = any, F = any> {
    type: T;
    value?: F;
}
export type ReducerFunObj<T, F extends keyof T> = {
    [p in F]: ReducerFun<T, F> | Array<ReducerFun<T, F>>;
};
export type ReducerFun<T, F extends keyof T> = (
    state: T[F],
    action: Action
) => T[F];
export default function warning(message: string): void {
    /* eslint-disable no-console */
    if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error(message);
    }
    /* eslint-enable no-console */
    try {
        throw new Error(message);
    } catch (e) {} // eslint-disable-line no-empty
}

export type DispatchFun<T> = (
    action: Action,
    storeKey?: keyof T
) => Action<any, any>;

export type MiddlewareFun<T> = (
    next: DispatchFun<T>
) => (action: Action, storeKey?: keyof T) => any;

export type Middleware<T> = { [key in keyof T]: Array<MiddlewareFun<T>> };
