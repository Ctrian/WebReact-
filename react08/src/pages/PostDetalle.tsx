import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import type {Post} from "../models/Post.ts"
import type {Comment} from "../models/Comment.ts"

function PostDetalle() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const {id} = useParams<{ id: string }>();
    const [post, setPost] = useState<Post>({id: 0, title: "", body: ""})
    const [comentarios, setComentarios] = useState<Comment[]>([])
    const [loadingComentarios, setLoadingComentarios] = useState(true);

    const handleEditar = () => {
        axios.put<Post>(`${url}/${id}`, post)
            .then(r => {
                setPost(r.data);
                alert("Post actualizado con éxito" + r.data.id);
            })
            .catch(e => {
                console.log("Error al actualizar el post", e);
            })
    }

    useEffect(() => {
        axios.get<Post>(`${url}/${id}`)
            .then(r => {
                setPost(r.data);
            })
            .catch(e => {
                alert("Error al cargar el post" + e);
            })
    }, [id])

    useEffect(() => {
        const cargarComentarios = async () => {
            try {
                const response = await axios.get<Comment[]>(`${url}/${id}/comments`);
                setComentarios(response.data);
            } catch (error) {
                console.log("Error al cargar los comentarios", error);
                alert("Error al cargar los comentarios");
            } finally {
                setLoadingComentarios(false);
            }
        };

        if (id) {
            cargarComentarios().then(() => console.log("Comentarios cargados con éxito"));
        }
    }, [id])

    return (
        <>
            <Box sx={{maxWidth: 600, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p: 4}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Editar Post</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight: "bold"}}>
                                <b>ID: {post.id}</b>
                            </Typography>
                        </Box>

                        <TextField
                            label={"Titulo del post"}
                            variant="outlined"
                            value={post.title}
                            fullWidth={true}
                            onChange={(e) => setPost({...post, title: e.target.value})}
                        />

                        <TextField
                            label={"Contenido"}
                            variant="outlined"
                            value={post.body}
                            fullWidth={true}
                            multiline={true}
                            rows={4}
                            onChange={(e) => setPost({...post, body: e.target.value})}
                        />

                        <CardActions sx={{justifyContent: "flex-start", px: 4, pb: 4}}>
                            <Button variant={"outlined"}
                                    color="primary"
                                    size="large"
                                    onClick={handleEditar}>
                                Actualizar
                            </Button>

                            <Button
                                variant={"contained"}
                                color="primary"
                                size={"large"}
                                component={Link} to={"/posts"}
                            >
                                Regresar
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>

                {/* Comentarios Section */}
                <Box sx={{mt: 4}}>
                    <Typography variant="h5" gutterBottom>
                        Comentarios ({comentarios.length})
                    </Typography>

                    {loadingComentarios ? (
                        <Typography variant="h6">Cargando comentarios...</Typography>
                    ) : (
                        <Table sx={{mt: 2}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                                    <TableCell sx={{color: "green", textAlign: "center"}}>Nombre</TableCell>
                                    <TableCell sx={{color: "green", textAlign: "center"}}>Email</TableCell>
                                    <TableCell sx={{color: "green", textAlign: "center"}}>Comentario</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comentarios.map((comentario) => (
                                    <TableRow key={comentario.id}>
                                        <TableCell sx={{color: "red", textAlign: "center"}}>{comentario.id}</TableCell>
                                        <TableCell
                                            sx={{color: "red", textAlign: "center"}}>{comentario.name}</TableCell>
                                        <TableCell
                                            sx={{color: "red", textAlign: "center"}}>{comentario.email}</TableCell>
                                        <TableCell
                                            sx={{color: "red", textAlign: "center"}}>{comentario.body}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default PostDetalle;