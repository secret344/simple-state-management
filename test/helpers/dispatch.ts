import { DispatchFun } from "../../src/type/dispatch";
import { AnyAction } from "../../src/type/interface";

export let dispatch: DispatchFun<any> = function (
    action: AnyAction,
    storeKey?: any
) {
    return action;
};
