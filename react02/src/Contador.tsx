import {useEffect, useState} from "react";

function Contador()



    {
const [contador, setContador] = useState(0);

        useEffect(()=>{
            console.log("COMPONENTE MONATADO");

                return() => {
                    console.log("COMPONENTE DESMONTADO");
                }
        })


        useEffect(() => {
            console.log(`CONTADOR CAMBIADO${contador}`);
        },[contador]);



        const handleUp  = () => {
            setContador(contador + 1);
        }

        const handleDown = () => {
            setContador(contador - 1);
        }

        return (
            <>
                <div>Valor {contador}</div>
                <br/>
                <button onClick={handleUp}>+</button>
                <button onClick={handleDown}> -</button>
                <br/>

            </>

        )
    }

export default Contador;