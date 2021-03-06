/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function emitListeners(nextListeners, storeKey) {
  var listeners = nextListeners.get(storeKey) || [];

  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    listener();
  }
}

function isFunctionFn(fn) {
  return Object.prototype.toString.call(fn) === "[object Function]" || typeof fn === "function";
}

function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    return console.warn(message);
  }
  /* eslint-enable no-console */


  try {
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function createStore(state, options) {
  if (typeof state !== "object" || state === null || isFunctionFn(state)) {
    throw new Error("Store must be an object");
  }

  var p = __assign({}, state);

  var idx = 0;
  var defIndex = options ? options.defaultKeyIndex || 0 : 0;
  var defaultKey = "";

  for (var key in state) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      if (idx === 0) {
        defaultKey = key;
      }

      if (idx === defIndex) {
        defaultKey = key;
        idx++;
        break;
      }

      idx++;
    }
  }

  if (idx === 0) {
    throw new Error("There's no data. store:" + state);
  }

  var isDispatching = false;
  var nextListeners = new Map();
  var ReducerDefault = defaultKey;
  var currentState = setProxy(p);
  var reducersMap = new Map();
  /**
   * subscribe
   * @param listener
   * @param key
   * @returns
   */

  function subscribe(listener, key) {
    if (!isFunctionFn(listener)) {
      throw new Error("Expected the listener to be a function.");
    }

    var isSubscribed = true;
    key = key || ReducerDefault;
    var stateListeners = nextListeners.get(key);

    if (Array.isArray(stateListeners)) {
      stateListeners.push(listener);
    } else {
      nextListeners.set(key, [listener]);
      stateListeners = nextListeners.get(key);
    }

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error("You may not unsubscribe from a store listener while the reducer is executing.");
      }

      isSubscribed = false;
      var index = stateListeners.indexOf(listener);
      stateListeners.splice(index, 1);
    };
  }
  /**
   * getStateCut
   * @param key
   * @returns
   */


  function getStateCut(key) {
    var k = key || ReducerDefault;
    var curstate = currentState[k];

    if (typeof curstate === "undefined") {
      throw new Error("The key entered is invalid");
    }

    return curstate;
  }

  function setProxy(state) {
    var handler = {
      get: function (target, key, receiver) {
        var res = Reflect.get(target, key, receiver);

        if (typeof res === "object") {
          return setProxy(res);
        }

        return res;
      },
      set: function (target, key, value, receiver) {
        if (!isDispatching) {
          throw new Error("Do not modify the internal values of the repository externally. all changes must be made sync");
        }

        var res = Reflect.set(target, key, value, receiver);
        return res;
      }
    };
    return new Proxy(state, handler);
  }
  /**
   * dispatch
   * @param action
   * @param storeKey
   * @returns
   */


  var dispatch = function (action, storeKey) {
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    var key = storeKey || ReducerDefault;
    var currentReducers = reducersMap.get(key);

    if (!currentReducers) {
      throw new Error("You must call Dispatch after setting the Reducers");
    }

    var curState = currentState[key];

    try {
      var state_1 = curState;
      isDispatching = true;

      if (Array.isArray(currentReducers)) {
        currentReducers.forEach(function (item) {
          var s = item(curState, action);

          if (typeof s === "object") {
            state_1 = Object.assign(state_1, s);
          } else {
            state_1 = s;
          }
        });
      } else {
        state_1 = currentReducers(curState, action);
      }

      if (typeof state_1 !== "undefined" && !isFunctionFn(state_1)) {
        currentState[key] = state_1;
      } else if (process.env.NODE_ENV !== "production") {
        warning("You must ensure that the Reducer returns the modified store");
      }
    } catch (rej) {
      throw new Error(rej);
    } finally {
      isDispatching = false;
      emitListeners(nextListeners, key);
    }

    return action;
  };

  if (options && typeof options.enhancerDispatch !== "undefined") {
    if (typeof options.enhancerDispatch !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }

    dispatch = options.enhancerDispatch(dispatch);
  }

  function createReducer(reducerFun, storeKey) {
    var currentReducer = reducerFun;

    if (typeof storeKey !== "undefined" && typeof storeKey === "string") {
      return setReducerMap(storeKey);
    }

    if (typeof reducerFun === "function" || Array.isArray(reducerFun)) {
      return setReducerMap(ReducerDefault);
    }

    if (typeof reducerFun === "object" && reducerFun !== null) {
      for (var key in reducerFun) {
        if (Object.prototype.hasOwnProperty.call(reducerFun, key)) {
          var s = reducerFun[key];
          currentReducer = s;
          setReducerMap(key);
        }
      }

      return;
    }

    throw new Error("The type Reducers must be Object or Function or Array<Function>");

    function setReducerMap(key) {
      var action = reducersMap.get(key);

      if (action) {
        throw new Error("You cannot set the Reducer repeatedly,The duplicate key value is ---" + key);
      }

      if (Array.isArray(currentReducer)) {
        var m = [];

        for (var i = 0; i < currentReducer.length; i++) {
          var s = currentReducer[i];

          if (process.env.NODE_ENV !== "production") {
            var index = m.indexOf(s);

            if (index >= 0) {
              warning("Multiple Reducers being the same is not recommended, which would cause ReplacerEducer method replacement exceptions");
            }
          }

          m.push(s);
        }

        currentReducer = m;
      }

      reducersMap.set(key, currentReducer);
    }
  }
  /**
   * replaceReducer
   * @param reducerFun
   * @param newReducerFun
   * @param storeKey
   */


  function replaceReducer(reducerFun, newReducerFun, storeKey) {
    if (!isFunctionFn(newReducerFun)) {
      throw new Error("Expected the nextReducer to be a function.");
    }

    var key = storeKey || ReducerDefault;
    var reducers = reducersMap.get(key);

    if (!reducers) {
      throw new Error("You must specify a store.");
    }

    var isReplace = false;

    if (!Array.isArray(reducers)) {
      if (reducers === reducerFun) {
        isReplace = true;
        reducersMap.set(key, newReducerFun);
      }
    } else {
      var len = reducers.length;

      for (var i = 0; i < len; i++) {
        var reducer = reducers[i];

        if (reducer === reducerFun) {
          isReplace = true;
          reducers.splice(i, 1, newReducerFun);
          break;
        }
      }

      reducersMap.set(key, reducers);
    }

    if (!isReplace) {
      throw new Error("The reducer to be replaced was not found");
    }
  }

  return {
    subscribe: subscribe,
    getStateCut: getStateCut,
    dispatch: dispatch,
    createReducer: createReducer,
    replaceReducer: replaceReducer
  };
}

function compose() {
  var funs = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    funs[_i] = arguments[_i];
  }

  if (funs.length === 0) {
    return;
  }

  if (funs.length === 1) {
    return funs[0];
  }

  return funs.reduce(function (a, b) {
    return function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return a(b.apply(void 0, args));
    };
  });
}

function applyMiddleware(middleware) {
  return function (dispatch) {
    var fun = dispatch;
    var middle = {};

    for (var key in middleware) {
      if (Object.prototype.hasOwnProperty.call(middleware, key)) {
        // Not send store state
        var mw = middleware[key];

        if (!Array.isArray(mw)) {
          mw = [mw];
        }

        middle[key] = compose.apply(void 0, mw);

        if (process.env.NODE_ENV !== "production" && typeof middle[key] !== "function") {
          warning("Middleware must be a function,Otherwise the default dispatch will be invoked.");
        }
      }
    }

    dispatch = function (action, storeKey) {
      if (storeKey) {
        var patch = middle[storeKey];

        if (patch && typeof patch === "function") {
          return patch(fun)(action, storeKey);
        }
      }

      return fun(action, storeKey);
    };

    return dispatch;
  };
}

if (process.env.NODE_ENV !== "production") {
  warning('You are currently using minified code outside of NODE_ENV === "production".');
}

export { applyMiddleware, createStore };
