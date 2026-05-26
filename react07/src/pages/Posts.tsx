import {useEffect, useState} from "react";
import axios from "axios";
import {
    Button,
    Container,
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, ThemeProvider,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";

interface Posts {
    id: number;
    title: string;
    body: string;
}

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: '#90caf9'},
        secondary: {main: '#f48fb1'}
    }
})

function Posts() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(false);
    // const fetchPosts = () => {
    //     setLoading(true);
    //     axios.get<Posts[]>("https://jsonplaceholder.typicode.com/posts")
    //         .then(r => {
    //             setPosts(r.data);
    //         })
    //         .catch(e => alert("Error al cargar los posts: " + e))
    //         .finally(() => setLoading(false));
    // }

    useEffect(() => {
        setLoading(true);
        axios.get<Posts[]>("https://jsonplaceholder.typicode.com/posts")
            .then(r=> {
                setPosts(r.data);
            })
            .catch(e=> alert(
                e
            ))
            .finally(()=> setLoading(false))
    }, [])

    return (
        <Container sx={{mt: 4}}>
            <h4>Esta es la página de Posts</h4>
            <Typography variant="h4" gutterBottom>
                Posts
            </Typography>

            {/*<Button*/}
            {/*    variant="contained"*/}
            {/*    color="primary"*/}
            {/*    onClick={() => fetchPosts()}*/}
            {/*    disabled={loading}*/}
            {/*>*/}
            {/*    {loading ? "Cargando..." : "Cargar Posts"}*/}
            {/*</Button>*/}
            {loading ? (
                <Typography variant="h6">Cargando posts...</Typography>
            ) : <ThemeProvider theme={darkTheme}>
                <Table sx={{mt: 2}}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Titulo</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Body</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{post.id}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{post.title}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{post.body}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>
                                    <Button color={"secondary"} variant={"outlined"} component={Link} to={`/posts/${post.id}`}>
                                        Ver Detalle
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ThemeProvider>}
        </Container>
    )
}

export default Posts;