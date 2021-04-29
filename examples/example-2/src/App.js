import "./App.css";
import Home from "./home";
import { useState } from "react";
import store from "./store/state";
import { addNum, changeName, lessenNum } from "./store/createAction";

function App() {
    const [name, setname] = useState("");
    const [num, setnum] = useState(1);
    function onChange(e) {
        setname(e.target.value);
    }
    function changeNum(e) {
        setnum(+e.target.value);
    }
    function increment() {
        store.dispatch(addNum(num));
    }
    function decrement() {
        store.dispatch(lessenNum(num));
    }
    function changename() {
        store.dispatch(changeName(name));
    }
    return (
        <div className="App">
            <Home></Home>
            <label>
                输入name
                <input onChange={onChange} />
            </label>
            <label>
                <button onClick={changename}> changename</button>
            </label>
            <br />
            <label>
                输入num
                <input type="number" onChange={changeNum} />
            </label>
            <button onClick={increment}> increment num</button>
            <button onClick={decrement}> decrement num</button>
        </div>
    );
}

export default App;
