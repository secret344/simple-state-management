import { changeText } from "./helpers/actionCreators";
import {
    createReducerTest,
    createReducerTestNotReturn,
    replaceReducerTest,
    replaceTodosReverse,
} from "./helpers/reducers";
import { reducerStore, reducerStoreProto } from "./helpers/store";
import { createStore } from "../src";

describe("replaceReducer", () => {
    it("newReducerFun is not function", () => {
        const store = createStore(reducerStoreProto());
        let r = store.replaceReducer;
        expect(() => r(1 as any, 2 as any)).toThrowError(
            "Expected the nextReducer to be a function."
        );
    });
    it("no store", () => {
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        expect(() =>
            store.replaceReducer(1 as any, replaceTodosReverse as any)
        ).toThrowError("You must specify a store.");
    });
    it("When the reducer is the array is the replacement", () => {
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        store.createReducer([createReducerTest], "a");
        store.replaceReducer(createReducerTest, replaceReducerTest, "a");
        store.dispatch(changeText("world"));
        expect(store.getStateCut()).toEqual({
            x: "helloworld",
        });
    });
    it("When the reducer is the array is the replacement", () => {
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        store.createReducer([createReducerTest], "a");
        expect(() =>
            store.replaceReducer(
                createReducerTestNotReturn as any,
                replaceReducerTest,
                "a"
            )
        ).toThrowError("The reducer to be replaced was not found");
    });
});
