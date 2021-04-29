import { ADD_NUM, LESSEN_NUM, CHANGE_NAME } from "./createAction";

export function stateReducerNum(state, action) {
    let num = action.num || 1;
    switch (action.type) {
        case ADD_NUM:
            state.num += num;
            break;
        case LESSEN_NUM:
            state.num -= num;
            break;
        default:
            break;
    }
    return state;
}
export function stateReducerName(state, action) {
    switch (action.type) {
        case CHANGE_NAME:
            state.name = action.name;
            break;
        default:
            break;
    }
    return state;
}
