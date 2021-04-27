import { AnyAction, DispatchFun } from "../../src/types/interface";

export let dispatch: DispatchFun<any> = function (
    action: AnyAction,
    storeKey?: any
) {
    return action;
};
