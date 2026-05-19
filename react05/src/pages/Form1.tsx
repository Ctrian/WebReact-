import {useState} from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

function Form1() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/form2", { state: { message: name } });
    };

    return(
        <>
            <form onSubmit={handleSubmit}>

                <h2>Formulario 1</h2>
                Nombre: <input type="text"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            placeholder="Ingrese su nombre"/>

                <button type={"submit"}>Enviar</button>
            </form>
        </>
    )
}

export default Form1;