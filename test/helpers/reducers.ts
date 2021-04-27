import {
    ADD_NUM,
    ADD_NUM_RETURN,
    CHANGE_NUM,
    CHANGE_TEXT,
} from "./actionTypes";
import { ReducerOneStore } from "./store";

export interface Todo {
    num: number;
}
export type TodoAction = { type: "ADD_NUM" | "ADD_NUM_RETURN"; num?: number };
export function todosReverse(state: Todo, action: TodoAction) {
    switch (action.type) {
        case ADD_NUM:
            state.num += action.num;
            return state;
        case ADD_NUM_RETURN:
            return { num: (state.num += action.num) };
        default:
            return state;
    }
}
export function replaceTodosReverse(state: Todo, action: TodoAction) {
    switch (action.type) {
        case ADD_NUM:
            state.num -= action.num;
            return state;
        case ADD_NUM_RETURN:
            return { num: (state.num -= action.num) };
        default:
            return state;
    }
}
export interface TodoReducerStoreAction {
    type: string;
    text?: string;
}
export function createReducerTest(
    state: ReducerOneStore,
    action: TodoReducerStoreAction
) {
    switch (action.type) {
        case CHANGE_TEXT:
            state.x = action.text;
            return state;
        default:
            return state;
    }
}
export function replaceReducerTest(
    state: ReducerOneStore,
    action: TodoReducerStoreAction
) {
    switch (action.type) {
        case CHANGE_TEXT:
            state.x = state.x + action.text;
            return state;
        default:
            return state;
    }
}
export function createReducerTestNotReturn(
    state: ReducerOneStore,
    action: TodoReducerStoreAction
) {
    switch (action.type) {
        case CHANGE_TEXT:
            state.x = action.text;
            break;
        default:
            break;
    }
}
export interface TodoReducerStoreActionNumber {
    type: string;
    num?: 123;
}
export function createReducerTestNumber(
    state: number,
    action: TodoReducerStoreActionNumber
) {
    switch (action.type) {
        case CHANGE_NUM:
            state += action.num;
            return state;
        default:
            return state;
    }
}
