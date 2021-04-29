import { createStore } from "./ssmutil";
import { stateReducerName, stateReducerNum } from "./reducer";
const state = {
    num: 0,
    name: "hello",
};
let store = createStore({ state });
store.createReducer([stateReducerNum, stateReducerName]);
export default store;
