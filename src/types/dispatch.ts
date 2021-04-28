import { Action, AnyAction } from "./interface";

export type DispatchFun<T, A extends Action = AnyAction> = {
    (action: Action, storeKey?: keyof T): A;
};

export interface EnhancerDispatch<T> {
    (dispatch: DispatchFun<T>): DispatchFun<T>;
}
