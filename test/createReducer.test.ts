import { createStore } from "../src";
import { changeNum, changeText } from "./helpers/actionCreators";
import { createReducerTest, createReducerTestNumber } from "./helpers/reducers";
import { reducerStore, reducerStoreProto } from "./helpers/store";

describe("createReducer", () => {
    it("reducer is function", () => {
        const store = createStore(reducerStore);
        store.createReducer(createReducerTest);

        store.dispatch(changeText("world"));
        expect(store.getStateCut()).toEqual({ x: "world" });
        expect(store.getStateCut("a")).toEqual({ x: "world" });

        expect(() => store.createReducer(createReducerTestNumber)).toThrowError(
            "You cannot set the Reducer repeatedly"
        );
    });
    it("reducer is array", () => {
        const store = createStore(reducerStore);
        store.createReducer([createReducerTest], "a");

        store.dispatch(changeText("world"));
        expect(store.getStateCut()).toEqual({ x: "world" });
        expect(store.getStateCut("a")).toEqual({ x: "world" });

        expect(() => store.createReducer(createReducerTestNumber)).toThrowError(
            "You cannot set the Reducer repeatedly"
        );

        store.createReducer([createReducerTestNumber], "b");
    });
    it("reducer is Object", () => {
        const store = createStore(reducerStore);
        store.createReducer({
            a: [createReducerTest],
            b: [createReducerTestNumber],
        });

        store.dispatch(changeText("world"));
        store.dispatch(changeNum(1), "b");
        expect(store.getStateCut()).toEqual({ x: "world" });
        expect(store.getStateCut("a")).toEqual({ x: "world" });
        expect(store.getStateCut("b")).toEqual(124);

        expect(() =>
            store.createReducer({
                a: [createReducerTest],
                b: [createReducerTestNumber],
            })
        ).toThrowError("You cannot set the Reducer repeatedly");
    });

    it("The reducer contains inherited attributes", () => {
        const store = createStore(reducerStoreProto());
        store.createReducer({
            a: [createReducerTest],
            b: [createReducerTestNumber],
        });

        store.dispatch(changeText("world"));
        store.dispatch(changeNum(1), "b");
        expect(store.getStateCut()).toEqual({ x: "world" });
        expect(store.getStateCut("a")).toEqual({ x: "world" });
        expect(store.getStateCut("b")).toEqual(124);
        expect(() => store.getStateCut("custome" as any)).toThrowError(
            "The key entered is invalid"
        );
    });

    it("The reducer is set multiple times to the same", () => {
        const preSpy = console.warn;
        const spy = jest.fn();
        console.warn = spy;
        const store = createStore(reducerStoreProto());
        store.createReducer({
            a: [createReducerTest, createReducerTest],
        });
        expect(spy.mock.calls[0][0]).toMatch(
            /Multiple Reducers being the same is not recommended/
        );
        spy.mockClear();
        console.warn = preSpy;
    });

    it("reducer is null and number", () => {
        const store = createStore(reducerStore);
        expect(() => store.createReducer(123 as any)).toThrowError(
            "The type Reducers must be Object or Function or Array<Function>"
        );
        expect(() => store.createReducer(null as any)).toThrowError(
            "The type Reducers must be Object or Function or Array<Function>"
        );
    });
});
