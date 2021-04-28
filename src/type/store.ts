import { DispatchFun } from "./dispatch";
import { Action, AnyAction, ReducerFun, ReducerFunObj } from "./interface";

export type Middleware<T> = any;

export type AnyStore = {
    [P in string]: any;
};

export interface Unsubscribe {
    (): void;
}

export interface Store<T = AnyStore> {
    subscribe(listener: () => void, key?: keyof T): Unsubscribe;
    getStateCut<F extends keyof T>(key?: F): T[F];
    dispatch: DispatchFun<keyof T>;
    createReducer<K extends keyof T, A extends Action = AnyAction>(
        reducerFun: ReducerFun<T, T[K], A> | ReducerFunObj<T, K, any>
    );
    createReducer<K extends keyof T, A extends Action = AnyAction>(
        reducerFun: ReducerFun<T, T[K], A> | Array<ReducerFun<T, T[K], A>>,
        storeKey: K
    ): void;
    replaceReducer<K extends keyof T, A extends Action = AnyAction>(
        reducerFun: ReducerFun<T, T[K], A>,
        newReducerFun: ReducerFun<T, T[K], A>,
        storeKey?: K
    ): void;
}
