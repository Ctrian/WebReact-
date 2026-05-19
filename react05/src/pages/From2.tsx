import {useNavigate, useLocation} from "react-router-dom";

function Form2() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as {message: string } || null;

    const handleRegresar = ()=> {
        navigate("/");
    }
    return(
        <>
            <form>
                <h2>Formulario 2</h2>

                {
                    state ? (
                <p>
                Nombre recibido: <b>{state.message}</b>
                </p>
                    ): (
                        <p>No se recibio ningun nombre! </p>
                    )
                }

                <button type='button' onClick={handleRegresar}>Regresar a Home</button>
            </form>
        </>
    )
}

export default Form2;