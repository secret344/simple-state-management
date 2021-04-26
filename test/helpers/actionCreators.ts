import {
    ADD_NUM,
    ADD_NUM_RETURN,
    CHANGE_TEXT,
    UNKNOWN_ACTION,
    CHANGE_NUM,
} from "./actionTypes";

export function addnum(num: number) {
    return { type: ADD_NUM, num };
}
export function addnumReturnNewState(num: number) {
    return { type: ADD_NUM_RETURN, num };
}
export function unknownAction() {
    return {
        type: UNKNOWN_ACTION,
    };
}

export function changeText(text: string) {
    return { type: CHANGE_TEXT, text };
}
export function changeNum(num: number) {
    return { type: CHANGE_NUM, num };
}
