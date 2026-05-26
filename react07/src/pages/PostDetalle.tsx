import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardActions, CardContent, TextField, Typography} from "@mui/material";
import type{Post} from "../models/Post.ts"

function PostDetalle() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const {id} = useParams<{ id: string }>();
    const [post, setPost] = useState<Post>({id: 0, title: "", body: ""})

    const handleGuardar = () => {
        axios.post<Post>(url, post)
            .then(r => {
                setPost(r.data);
                alert("Post guardado con éxito" + r.data.id);
            })
            .catch(e => {
                console.log("Error al guardar el post", e);
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

    return (
        <>
            {/*<div>{post.title}</div>*/}
            {/*<div>{post.body}</div>*/}
            {/*<Button variant={"contained"} component={Link} to={"/posts"}> Regresar</Button>*/}

            <Box sx={{maxWidth: 600, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p:4}}>
                        <h4>{post.title}</h4>
                        <h4>{post.body}</h4>

                        <Box sx={{display: "flex", fjustifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Editar Post</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight:"bold"}}>
                                <b>ID: {post.id}</b>
                            </Typography>
                        </Box>

                        <TextField
                            label={"Titulo del post"}
                            variant="outlined"
                            value={post.title}
                            fullWidth={true}
                            onChange={(e)=> setPost({...post, title:e.target.value})}
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
                                    onClick={handleGuardar}>
                                Guardar
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
            </Box>

            <div>{post.title}</div>
            <br/>
            <div>{post.body}</div>
        </>
    )
}

export default PostDetalle;