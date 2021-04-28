import { DispatchFun } from "../../src/types/dispatch";
import { AnyAction } from "../../src/types/interface";

export let dispatch: DispatchFun<any> = function (
    action: AnyAction,
    storeKey?: any
) {
    return action;
};
