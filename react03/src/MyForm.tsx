import * as React from "react";
import { useState } from "react";

function MyForm() {
    const [name, setName] = useState("");

    const handleClick = () => {
        alert("clicked");
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`Texto ingresado: ${name}`);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Nombre:{" "}
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                />
            </div>

            <input type="submit" value="Enviar1" />
            <input type="button" value="Enviar2" onClick={handleClick} />
            <input type="button" value="Enviar3" onClick={handleClick} />
            <br />
            <div>{name}</div>
        </form>
    );
}

export default MyForm;