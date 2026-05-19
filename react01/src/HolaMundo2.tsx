interface Hello2Props {
    name: string;
    age?: number;
}

function HolaMundo2(props: Hello2Props) {
    return (
        <>
            <h4>Hola mundo {props.name}</h4>
            {props.age && <h4>Edad: {props.age}</h4>}
        </>
    );
}

export default HolaMundo2;