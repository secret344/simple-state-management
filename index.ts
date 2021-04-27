import { createStore } from "./src/createStore";
import applyMiddleware from "./src/applyMiddleware";
import warning from "./src/utils/warning";
if (process.env.NODE_ENV !== "production") {
    warning(
        'You are currently using minified code outside of NODE_ENV === "production". '
    );
}
export { createStore, applyMiddleware };
