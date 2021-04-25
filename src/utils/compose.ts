export default function compose(...funs: Function[]) {
    if (funs.length === 0) {
        return;
    }

    if (funs.length === 1) {
        return funs[0];
    }

    return funs.reduce((a, b) => {
        return (...args: any) => a(b(...args));
    });
}
