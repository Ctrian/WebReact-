import {Container, Typography} from "@mui/material";

function Home() {
    return (
        <Container>
            <h4>Esta es la pagina de Home</h4>
            <Typography sx={{mt: 4}}>
                Bienvenidos
            </Typography>

            <Typography variant="h6">
                App para consultar POST´s
            </Typography>
        </Container>
    )
}

export default Home;