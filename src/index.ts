import { createStore } from "./createStore";
import applyMiddleware from "./applyMiddleware";
import warning from "./utils/warning";
if (process.env.NODE_ENV !== "production") {
    warning(
        'You are currently using minified code outside of NODE_ENV === "production".'
    );
}
export { createStore, applyMiddleware };
