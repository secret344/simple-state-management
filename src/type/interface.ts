import { DispatchFun } from "./dispatch";

export interface Action<K = any> {
    type: K;
}
export interface AnyAction extends Action {
    [key: string]: any;
}

export type ReducerFunObj<
    T,
    K extends keyof T,
    A extends Action = AnyAction
> = {
    [P in K]?: Array<ReducerFun<T, T[P], A>>;
};

export type ReducerFun<
    T,
    K extends T[keyof T],
    A extends Action = AnyAction
> = {
    (state: K, action: A): K;
};

export type MiddlewareFun<T, A extends Action = AnyAction> = (
    next: DispatchFun<T>
) => (action: A, storeKey?: keyof T) => any;

export type Middleware<T> = { [key in keyof T]: Array<MiddlewareFun<T>> };
