# simple-state-management

## 一个简单的状态管理库
还不成熟......

## Installation

```
npm install ssmutil
```

## warning
1. 你不能在除dispatch之外任意地方修改store的内容。
## Documentation

### createStore

1. 创建一个仓库，参数必须为一个{},我们可以传入多个仓库。例如：

```js
import ssmutil from "ssmutil";
let store = { store1: 1, store2: 2 };
ssmutil.createStore(store);
import {createStore} from "ssmutil";
createStore(store)
```

```js
import ssmutil from "ssmutil";
let store = { store1: { a: 1 }, store2: { b: 2 } };
ssmutil.createStore(store);
import {createStore} from "ssmutil";
createStore(store)
```

2. 我们可以传入第二个参数去控制默认 store，以及增强 dispatch(内置了 applyMiddleware)
    - defaultKeyIndex 默认仓库索引，控制默认 store，在我们不传入 storeKey 时默认将会对此参数所代指的 store 操作，默认为 0，当传入索引大于当前全部仓库数量时，我们第一个为默认。
    - enhancerDispatch 增强 dispatch，值为函数，接收 dispatch 为参数，返回一个 dispatch
    ```js
    ssmutil.createStore(
        { store },
        {
            defaultKeyIndex: 0,
            enhancerDispatch: ssmutil.applyMiddleware({
                store: [
                    (next) => (action, key) => {
                        next(action, key);
                    },
                ],
            }),
        }
    );
    ```
3. createStore 返回一个对象，我们将在下面介绍。

#### 1) getStateCut

1. key 接收一个 key 值，将返回同名仓库的 state

-   不传参数将获取默认仓库的 state，注意在使用 typescript 时不传参数会导致类型推断为a | b，你可以使用断言解决。

```js
let store = ssmutil.createStore({ a: 1 });
store.getStateCut(); //返回1
```

#### 2) createReducer

创建 Reducer

1. 参数为单一函数时，将此 Reducer 赋给 默认 store
2. 参数为 object 时，键为所要作用的 store 名字，值为 reducer，且为数组，可以为多个，将在 dispatch 时 forin 触发。
3. 参数不为 object 时，可以传入 storeKey 作为第二个参数，以指明所要作用的 store。
4. 参数不为 object 时，不传入 storeKey 时，typescript 会推断为 a|b，断言可以解决

```js
let store = ssmutil.createStore({ a: 1 });
store.createReducer((state,action)=> void)
```

#### 3) dispatch

1. dispatch 在使用之前必须创建相应的 reducer
2. action 所要触发的 action
3. storeKey 所要作用的 store
4. storeKey 在不传时作用于默认 store，并且不会触发 applyMiddleware 绑定的函数

```js
let store = ssmutil.createStore({ a: 1 });
store.createReducer((state,action)=> void)
```

#### 4) subscribe

1. 第一个参数为函数，将在 dispatch 之后触发
2. key 订阅同名仓库，将在 dispatch 时触发

```js
let store = ssmutil.createStore({ a: 1 });
store.subscribe(() => {});
```

#### 5) replaceReducer

1. 第一个参数为旧的 reducer
2. 第二个参数为新的 reducer
3. 第三个参数为所要替换 store 的 key，不传为替换默认 store 下的 reducer
4. 替换已经存在的 reducer,使用 a===b 做判断.
5. 创建 reducer 我们允许同一函数多次创建，并且都会触发，替换时我们只会替换找到的第一个。

```js
    let store = ssmutil.createStore({ a: 1 });
    let a = (state,action)=> void
    let b = (state,action)=> void
    store.createReducer(a)
    store.replaceReducer(a,b)
```

### applyMiddleware

创建中间件，作为 createStore 时第二个参数的 enhancerDispatch 选项值

1. 参数为数组，类型如下
    ```js
    (next) => (action, key) => {
        next(action, key);
    };
    ```
 最后一次next总是为dispatch,详细参考examples文件夹案例.
