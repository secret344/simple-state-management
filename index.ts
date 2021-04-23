import { createStore } from "./src/createStore";
import warning from "./src/types/listener_type";
if (process.env.NODE_ENV !== "production") {
    warning(
        'You are currently using minified code outside of NODE_ENV === "production". '
    );
}
window["create"] = createStore;
export { createStore };
