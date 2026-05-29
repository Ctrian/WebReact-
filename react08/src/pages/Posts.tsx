import {useEffect, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import type {Post} from "../models/Post.ts"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: '#90caf9'},
        secondary: {main: '#f48fb1'}
    }
})

function Posts() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [getId, setGetId] = useState('');
    const [newPost, setNewPost] = useState({title: '', body: '', userId: 1});

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
            axios.delete(`${url}/${id}`)
                .then(() => {
                    setPosts(posts.filter(post => post.id !== id));
                    alert('Post eliminado correctamente');
                })
                .catch(e => {
                    console.log('Error al eliminar el post', e);
                    alert('Error al eliminar el post');
                });
        }
    };

    const handleGetById = () => {
        if (!getId) {
            alert('Por favor ingrese un ID');
            return;
        }
        axios.get<Post>(`${url}/${getId}`)
            .then(r => {
                alert(`Post encontrado: ${JSON.stringify(r.data, null, 2)}`);
            })
            .catch(e => {
                console.log('Error al obtener post por ID', e);
                alert('Error al obtener el post');
            });
    };

    const handleCreatePost = () => {
        // Basic validation
        if (!newPost.title || !newPost.body) {
            alert('Por favor complete los campos obligatorios (título, body)');
            return;
        }
        axios.post<Post>(url, newPost)
            .then(r => {
                alert(`Post creado: ${JSON.stringify(r.data, null, 2)}`);
                // Reset form
                setNewPost({title: '', body: '', userId: 1});
            })
            .catch(e => {
                console.log('Error al crear post', e);
                alert('Error al crear el post');
            });
    };

    useEffect(() => {
        axios.get<Post[]>(`${url}`)
            .then(r => {
                setPosts(r.data);
            })
            .catch(e => alert(
                e
            ))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Container sx={{mt: 4}}>
            <h4>Esta es la página de Posts</h4>
            <Typography variant="h4" gutterBottom>
                Posts
            </Typography>

            <Box sx={{mt: 3, p: 2, border: '1px solid grey', borderRadius: 2, bgcolor: 'white'}}>
                <Typography variant="h5" gutterBottom>
                    Buscar Post por ID
                </Typography>
                <TextField
                    label="ID del Post"
                    type="number"
                    value={getId}
                    onChange={(e) => setGetId(e.target.value)}
                    sx={{width: 200, marginBottom: 2}}
                />
                <Button variant="contained" color="primary" onClick={handleGetById} sx={{ml: 2}}>
                    Buscar
                </Button>
            </Box>

            <Box sx={{mt: 3, p: 2, border: '1px solid grey', borderRadius: 2, bgcolor: 'white'}}>
                <Typography variant="h5" gutterBottom>
                    Crear Nuevo Post
                </Typography>
                <TextField
                    label="Título"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <TextField
                    label="Contenido"
                    value={newPost.body}
                    onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                    multiline
                    rows={4}
                />
                <TextField
                    label="User ID"
                    type="number"
                    value={newPost.userId}
                    onChange={(e) => setNewPost({...newPost, userId: parseInt(e.target.value) || 1})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <Button variant="contained" color="success" onClick={handleCreatePost} sx={{mt: 2}}>
                    Crear Post
                </Button>
            </Box>

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
                                    <Button color={"secondary"} variant={"outlined"} component={Link}
                                            to={`/posts/${post.id}`}>
                                        Ver Detalle
                                    </Button>
                                    <Button color={"error"} variant={"outlined"} sx={{ml: 1}}
                                            onClick={() => handleDelete(post.id)}>
                                        Eliminar
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