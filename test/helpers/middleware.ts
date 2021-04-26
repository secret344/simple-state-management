import { ERROR } from "./actionTypes";

export let modeMiddlewareError = () => {
    return {
        enhancerDispatchStoreNumData: [
            (next) => (action, key) => {
                if (action.type === ERROR) {
                    throw new Error("ERROR");
                }
                next(action, key);
            },
            (next) => (action, key) => {
                next(action, key);
            },
        ],
    };
};

export let modeMiddleware = () => {
    return {
        enhancerDispatchStoreNumData: [
            (next) => (action, key) => {
                if (action.type === ERROR) {
                    throw new Error("ERROR");
                }
                next(action, key);
            },
            (next) => (action, key) => {
                next(action, key);
            },
        ],
    };
};
