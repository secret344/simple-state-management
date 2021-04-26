import { createStore } from "../../src/createStore";

export function moreCreateStore() {}
moreCreateStore.prototype.createStore = createStore;
