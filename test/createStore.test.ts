import {
    storeData,
    storeNumData,
    replaceStoreNumData,
    enhancerDispatchStoreNumData,
    reducerStore,
} from "./helpers/store";
import { createStore } from "../src/createStore";
import applyMiddleware from "../src/applyMiddleware";
import { modeMiddleware } from "./helpers/middleware";
import { AnyStore } from "../src/types/interface";
import { moreCreateStore } from "./helpers/morecreatestore";
import {
    addnum,
    addnumReturnNewState,
    changeText,
    unknownAction,
} from "./helpers/actionCreators";
import {
    createReducerTest,
    replaceTodosReverse,
    todosReverse,
} from "./helpers/reducers";
import { ERROR } from "./helpers/actionTypes";

describe("createStore", () => {
    it("store data must be Object", () => {
        expect(() => createStore(undefined)).toThrowError("Store must be");
        expect(() => createStore(("test" as unknown) as AnyStore)).toThrowError(
            "Store must be"
        );
        expect(() => createStore({})).toThrowError("There's no data");
        expect(() => createStore(null)).toThrowError("Store must be");
        expect(() => createStore(() => {})).toThrowError("Store must be");
    });
    it("exposes the public API", () => {
        const store = createStore({ storeData });
        const methods = Object.keys(store);

        expect(methods.length).toBe(5);
        expect(methods).toContain("subscribe");
        expect(methods).toContain("getStateCut");
        expect(methods).toContain("dispatch");
        expect(methods).toContain("createReducer");
        expect(methods).toContain("replaceReducer");
    });
    it("many times to create", () => {
        expect(() => createStore({ storeData })).toThrowError(
            "You cannot create a repository multiple times"
        );
    });
    it("passes the initial state", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ storeData });
        expect(store.getStateCut()).toEqual({});
    });

    it("applies the reducer to the previous state", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ storeNumData });
        expect(store.getStateCut()).toEqual({ num: 0 });
        expect(store.getStateCut("storeNumData")).toEqual({ num: 0 });
        store.createReducer(todosReverse);

        store.dispatch(addnum(1));
        expect(store.getStateCut()).toEqual({ num: 1 });
        expect(store.getStateCut("storeNumData")).toEqual({ num: 1 });

        store.dispatch(addnumReturnNewState(1));
        expect(store.getStateCut()).toEqual({ num: 2 });
        expect(store.getStateCut("storeNumData")).toEqual({ num: 2 });
    });

    it("supports multiple subscriptions", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ storeData });
        store.createReducer(todosReverse);

        const listenerA = jest.fn();
        const listenerB = jest.fn();
        let unsubscribeA = store.subscribe(listenerA);
        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(1);
        expect(listenerB.mock.calls.length).toBe(0);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(2);
        expect(listenerB.mock.calls.length).toBe(0);

        const unsubscribeB = store.subscribe(listenerB);
        expect(listenerA.mock.calls.length).toBe(2);
        expect(listenerB.mock.calls.length).toBe(0);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(1);

        unsubscribeA();
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(1);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        unsubscribeB();
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        unsubscribeA = store.subscribe(listenerA);
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(4);
        expect(listenerB.mock.calls.length).toBe(2);
    });
    it("supports multiple subscriptions", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ storeData });
        store.createReducer(todosReverse);

        const listenerA = jest.fn();
        const listenerB = jest.fn();
        let unsubscribeA = store.subscribe(listenerA, "storeData");
        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(1);
        expect(listenerB.mock.calls.length).toBe(0);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(2);
        expect(listenerB.mock.calls.length).toBe(0);

        const unsubscribeB = store.subscribe(listenerB, "storeData");
        expect(listenerA.mock.calls.length).toBe(2);
        expect(listenerB.mock.calls.length).toBe(0);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(1);

        unsubscribeA();
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(1);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        unsubscribeB();
        unsubscribeB();
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        unsubscribeA = store.subscribe(listenerA, "storeData");
        expect(listenerA.mock.calls.length).toBe(3);
        expect(listenerB.mock.calls.length).toBe(2);

        store.dispatch(unknownAction());
        expect(listenerA.mock.calls.length).toBe(4);
        expect(listenerB.mock.calls.length).toBe(2);
    });

    it("options enhancerDispatch", () => {
        let create = new moreCreateStore();
        const store = create.createStore(
            { enhancerDispatchStoreNumData },
            { enhancerDispatch: applyMiddleware(modeMiddleware()) }
        );
        store.createReducer(todosReverse);
        expect(() => store.dispatch({ type: ERROR })).toThrow("ERROR");
        store.dispatch(addnum(1));
        expect(store.getStateCut()).toEqual({ num: 1 });
        expect(store.getStateCut("enhancerDispatchStoreNumData")).toEqual({
            num: 1,
        });
    });
    it("replaceReducers test", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ replaceStoreNumData });
        expect(store.getStateCut()).toEqual({ num: 0 });
        expect(store.getStateCut("replaceStoreNumData")).toEqual({ num: 0 });
        store.createReducer(todosReverse);

        store.dispatch(addnum(1));
        expect(store.getStateCut()).toEqual({ num: 1 });
        expect(store.getStateCut("replaceStoreNumData")).toEqual({ num: 1 });

        store.dispatch(addnumReturnNewState(1));
        expect(store.getStateCut()).toEqual({ num: 2 });
        expect(store.getStateCut("replaceStoreNumData")).toEqual({ num: 2 });

        store.replaceReducer(todosReverse, replaceTodosReverse);
        store.dispatch(addnum(1));
        expect(store.getStateCut()).toEqual({ num: 1 });
        expect(store.getStateCut("replaceStoreNumData")).toEqual({ num: 1 });

        store.dispatch(addnumReturnNewState(1));
        expect(store.getStateCut()).toEqual({ num: 0 });
        expect(store.getStateCut("replaceStoreNumData")).toEqual({ num: 0 });
    });
    it("throws if replaceReducer is not a function", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ num: 1 });
        store.createReducer(todosReverse);

        expect(() => store.replaceReducer(undefined, undefined)).toThrow(
            "Expected the nextReducer to be a function."
        );
    });
    it("throws if listener is not a function", () => {
        let create = new moreCreateStore();
        const store = create.createStore({ b: 1 });

        expect(() => store.subscribe(undefined)).toThrow();

        expect(() => store.subscribe(("" as unknown) as () => void)).toThrow();

        expect(() => store.subscribe(null)).toThrow();

        expect(() => store.subscribe(undefined)).toThrow();
    });
    it("DefaultKeyIndex exceeds the number of stores", () => {
        let create = new moreCreateStore();
        const store = create.createStore(reducerStore, { defaultKeyIndex: 3 });
        store.createReducer(createReducerTest);
        store.dispatch(changeText("world"));
        expect(store.getStateCut()).toEqual({
            x: "world",
        });
    });
    it("DefaultKeyIndex exceeds the number of stores", () => {
        let create = new moreCreateStore();
        const listenerA = jest.fn();
        const store = create.createStore(reducerStore, { defaultKeyIndex: 3 });
        let unsubscribeA = store.subscribe(listenerA);
        store.createReducer((action: any, key?: any) => {
            unsubscribeA();
            createReducerTest(action, key);
        });
        expect(() => store.dispatch(changeText("world"))).toThrowError(
            " You may not unsubscribe from a store listener while the reducer is executing."
        );
    });
});
