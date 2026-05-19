import {useState} from "react";
import HolaMundo from "./HolaMundo.tsx";
import HolaMundo2 from "./HolaMundo2.tsx";
import Contador from "./Contador.tsx";

function App() {

    const [name, setName] = useState('mundo!');
    const hanldeClick = () => {
        if ("mundo!" === name) {
            setName("JQuery!");
        } else {
            setName("mundo!");
        }

    }
    interface Hello2Props {
        name: string;
        age: number;
    }
    const props : Hello2Props = {
        name : "OTRO NOMBRE!",
        age : 20
    }
    return (
        <>
            Hola <span>{name}</span>
            <br/>
            <button onClick={hanldeClick}>Click</button>
            <br/>
            <HolaMundo/>
            <HolaMundo/>
            <HolaMundo/>
            <HolaMundo/>
            <br/>

            <HolaMundo2 name="Juan" age={20}/>
            <HolaMundo2 {...props}/>
            <HolaMundo2 name={props.name} age={props.age}/>
            <br/>
            <Contador ></Contador>

        </>
    )
}

export default App
