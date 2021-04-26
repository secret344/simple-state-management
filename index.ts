import { createStore } from "./src/createStore";
import applyMiddleware from "./src/applyMiddleware";
import warning from "./src/utils/warning";
if (process.env.NODE_ENV !== "production") {
    warning(
        'You are currently using minified code outside of NODE_ENV === "production". '
    );
}
let window = {};
window["create"] = createStore;
window["applyMiddleware"] = applyMiddleware;
export { createStore, applyMiddleware };
