import { useEffect, useState } from "react";
import store from "./store/state";

function Home() {
    const [name, setname] = useState(store.getStateCut().name);
    const [num, setnum] = useState(store.getStateCut().num);
    useEffect(() => {
        let unsubscribe = store.subscribe(() => {
            store.getStateCut();
            let newname = store.getStateCut().name;
            let newnum = store.getStateCut().num;
            newname !== name && setname(newname);
            newnum !== num && setnum(newnum);
        });
        return () => {
            unsubscribe();
        };
    });
    return (
        <div className="Home">
            <h1>name:{name}</h1>
            <h2>num:{num}</h2>
        </div>
    );
}

export default Home;
