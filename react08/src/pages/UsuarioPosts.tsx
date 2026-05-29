import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import type {Post} from "../models/Post.ts"


function UsuarioPosts() {
    const url = "https://jsonplaceholder.typicode.com/posts"; // Base URL for posts
    const {id: userId} = useParams<{ id: string }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [getId, setGetId] = useState('');
    // Definimos title, body, userId y el id opcional
    const [newPost, setNewPost] = useState<{ title: string, body: string, userId: number, id?: number }>({
        title: '',
        body: '',
        userId: Number(userId) || 1
    });

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
                // Populate the form with the retrieved post data for editing
                setNewPost({
                    title: r.data.title,
                    body: r.data.body,
                    userId: Number(userId) || 1, // Keep the current user's ID
                    id: r.data.id // Include the ID for PUT request
                });
                alert('Post cargado en el formulario. Puede modificar y actualizar.');
            })
            .catch(e => {
                console.log('Error al obtener post por ID', e);
                alert('Error al obtener el post');
            });
    };

    const handleUpdatePost = () => {
        // Basic validation
        if (!newPost.title || !newPost.body) {
            alert('Por favor complete los campos obligatorios (título, body)');
            return;
        }
        axios.put<Post>(`${url}/${newPost.id}`, newPost)
            .then(r => {
                alert(`Post actualizado: ${JSON.stringify(r.data, null, 2)}`);
                // Refresh the posts list
                cargarPosts().then(r => console.log('Posts recargados después de actualizar post', r));
            })
            .catch(e => {
                console.log('Error al actualizar el post', e);
                alert('Error al actualizar el post');
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
                setNewPost({title: '', body: '', userId: Number(userId) || 1});
                // Refresh the posts list
                cargarPosts().then(() => console.log('Posts recargados después de crear nuevo post', r));
            })
            .catch(e => {
                console.log('Error al crear post', e);
                alert('Error al crear el post');
            });
    };

    const cargarPosts = async () => {
        setLoadingPosts(true);
        try {
            const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.log("Error al cargar los posts del usuario", error);
            alert("Error al cargar los posts del usuario");
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        if (userId) {
            cargarPosts().then(r => console.log('Posts cargados para el usuario', r));
        }
    }, [userId])

    return (
        <>
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
                <Typography variant="body2"
                            sx={{width: '100%', marginBottom: 2, p: 1, border: '1px solid grey', borderRadius: 1}}>
                    User ID: {newPost.userId}
                </Typography>
                <Button variant="contained" color="success" onClick={handleCreatePost} sx={{mt: 2}}>
                    Crear Post
                </Button>
                <Button variant="contained" color="warning" onClick={handleUpdatePost} sx={{mt: 2, ml: 2}}>
                    Actualizar Post
                </Button>
            </Box>

            <Box sx={{maxWidth: 800, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p: 4}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Posts del Usuario</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight: "bold"}}>
                                <b>ID de Usuario: {userId}</b>
                            </Typography>
                        </Box>

                        {loadingPosts ? (
                            <Typography variant="h6">Cargando posts...</Typography>
                        ) : (
                            <Table sx={{mt: 2}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Título</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Cuerpo</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{post.id}</TableCell>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{post.title}</TableCell>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{post.body}</TableCell>
                                            <TableCell sx={{textAlign: "center"}}>
                                                <Button color={"error"} variant={"contained"} sx={{ml: 1}}
                                                        onClick={() => handleDelete(post.id)}>
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <CardActions sx={{justifyContent: "flex-start", px: 4, pb: 4}}>
                            <Button
                                variant={"contained"}
                                color="primary"
                                size={"large"}
                                component={Link} to={"/usuarios"}>
                                Regresar
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default UsuarioPosts;