function HolaMundo() {

    const handle = () =>{
        alert("Click Componete!");
    }
    return(
        <>
            <h4>Hola mundo!</h4>
            <b>Ejemplo de componente REACT</b>
            <br/>
            <button onClick={handle}>Click</button>
        </>
    )
}

export default HolaMundo