import { createStore } from "../src";
import { changeText } from "./helpers/actionCreators";

import {
    createReducerTest,
    createReducerTestNotReturn,
    createReducerTestNumber,
} from "./helpers/reducers";
import { reducerStore } from "./helpers/store";

describe("dispatch", () => {
    it("There is no Reducer", () => {
        const store = createStore(reducerStore);
        store.createReducer(createReducerTest);

        store.dispatch(changeText("world"));
        expect(store.getStateCut()).toEqual({ x: "world" });
        expect(store.getStateCut("a")).toEqual({ x: "world" });

        expect(() => store.createReducer(createReducerTestNumber)).toThrowError(
            "You cannot set the Reducer repeatedly"
        );
    });
    it("Reducers may not dispatch actions.", () => {
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        store.createReducer((action: any, key?: any) => {
            store.dispatch(changeText("world"));
            createReducerTest(action, key);
        });
        expect(() => store.dispatch(changeText("world"))).toThrowError(
            "Reducers may not dispatch actions."
        );
    });
    it("Set store data when not dispatching", () => {
        // 123
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        store.createReducer(createReducerTest);
        let state = store.getStateCut("b");
        state = 666;
        expect(store.getStateCut("b")).toEqual(123);
    });
    it("Set store data when not dispatching", () => {
        // 123
        const store = createStore(reducerStore, { defaultKeyIndex: 3 });
        let state = store.getStateCut("a");
        expect(() => (state.x = "666")).toThrowError(
            "Do not modify the internal values of the repository externally."
        );
    });
    it("There is no Reducer", () => {
        const store = createStore(reducerStore);
        expect(() => store.dispatch(changeText("world"))).toThrowError(
            "You must call Dispatch after setting the Reducers"
        );
    });
    it("The Reducer does not return a value", () => {
        const preSpy = console.error;
        const spy = jest.fn();
        console.error = spy;

        const store = createStore(reducerStore);
        store.createReducer(createReducerTestNotReturn);
        store.dispatch(changeText("world"));
        expect(spy.mock.calls[0][0]).toMatch(
            /You must ensure that the Reducer returns the modified store/
        );
        spy.mockClear();
        console.error = preSpy;
    });
    it("enhancerDispatch is not a function", () => {
        expect(() =>
            createStore(reducerStore, {
                enhancerDispatch: 123 as any,
            })
        ).toThrowError("Expected the enhancer to be a function.");
    });
});
