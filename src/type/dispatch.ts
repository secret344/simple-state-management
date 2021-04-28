import { Action, AnyAction } from "./interface";

export type DispatchFun<T, A extends Action = AnyAction> = {
    (action: A, storeKey?: T): A;
};

export interface EnhancerDispatch<T> {
    (dispatch: DispatchFun<keyof T>): DispatchFun<keyof T>;
}
