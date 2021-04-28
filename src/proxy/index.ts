function setProxy(state) {
    let _this = this;
    const handler = {
        get: function (target: any, key: any, receiver: any) {
            const res = Reflect.get(target, key, receiver);
            if (typeof res === "object") {
                return setProxy.call(_this, res);
            }
            return res;
        },
        set: function (target: any, key: any, value: any, receiver: any) {
            if (!_this.isDispatching) {
                throw new Error(
                    "Do not modify the internal values of the repository externally." +
                        "all changes must be made sync"
                );
            }
            const res = Reflect.set(target, key, value, receiver);
            return res;
        },
    };
    return new Proxy(state, handler);
}
export default setProxy;
