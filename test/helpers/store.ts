export const storeData = {};
export const storeNumData = { num: 0 };
export const replaceStoreNumData = { num: 0 };
export const enhancerDispatchStoreNumData = { num: 0 };
export interface ReducerOneStore {
    x: string;
}
export const reducerStore: {
    a: ReducerOneStore;
    b: number;
} = { a: { x: "hello" }, b: 123 };
