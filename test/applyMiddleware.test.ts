import applyMiddleware from "../src/applyMiddleware";
import { dispatch } from "./helpers/dispatch";

describe("applyMiddleware", () => {
    it("middleware is not function", () => {
        const preSpy = console.error;
        const spy = jest.fn();
        console.error = spy;
        applyMiddleware<object>({ a: 123 })(dispatch);

        expect(spy.mock.calls[0][0]).toMatch(
            /Middleware must be a function,Otherwise the default dispatch will be invoked./
        );
        spy.mockClear();
        console.error = preSpy;
    });
    it("middleware is number", () => {
        const preSpy = console.error;
        const spy = jest.fn();
        console.error = spy;
        let dis: any = applyMiddleware<object>({ a: 123 });
        dis = dis(dispatch);
        expect(dis({ type: "" }, ("a" as unknown) as never)).toEqual({
            type: "",
        });
        expect(spy.mock.calls[0][0]).toMatch(
            /Middleware must be a function,Otherwise the default dispatch will be invoked./
        );
        spy.mockClear();
        console.error = preSpy;
    });
    it("middleware is not function", () => {
        const preSpy = console.error;
        const spy = jest.fn();
        console.error = spy;
        let dis: any = applyMiddleware<object>({ a: [] });
        dis = dis(dispatch);
        expect(dis({ type: "" }, ("a" as unknown) as never)).toEqual({
            type: "",
        });
        expect(spy.mock.calls[0][0]).toMatch(
            /Middleware must be a function,Otherwise the default dispatch will be invoked./
        );
        spy.mockClear();
        console.error = preSpy;
    });
});
