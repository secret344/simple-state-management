export const CHANGE_NAME = "CHANGE_NAME";
export const ADD_NUM = "ADD_NUM";
export const LESSEN_NUM = "LESSEN_NUM";

function changeName(name) {
    return { type: CHANGE_NAME, name };
}
function addNum(num) {
    return { type: ADD_NUM, num };
}
function lessenNum(num) {
    return { type: LESSEN_NUM, num };
}

export { changeName, addNum, lessenNum };
