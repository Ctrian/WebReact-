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
    Typography
} from "@mui/material";
import type {User} from "../models/User.ts"

function Usuario() {
    const url = "https://jsonplaceholder.typicode.com/users";
    const {id} = useParams<{ id: string }>();
    const [usuario, setUsuario] = useState<User>({id: 0, name: "", username: "", email: "", phone: "", website: ""})

    const handleActualizar = () => {
        axios.put<User>(`${url}/${id}`, usuario)
            .then(r => {
                setUsuario(r.data);
                alert("Usuario actualizado con éxito" + r.data.id);
            })
            .catch(e => {
                console.log("Error al actualizar el usuario", e);
            })
    }

    useEffect(() => {
        axios.get<User>(`${url}/${id}`)
            .then(r => {
                setUsuario(r.data);
            })
            .catch(e => {
                alert("Error al cargar el usuario" + e);
            })
    }, [id])

    return (
        <>
            <Box sx={{maxWidth: 600, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p: 4}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Editar Usuario</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight: "bold"}}>
                                <b>ID: {usuario.id}</b>
                            </Typography>
                        </Box>

                        <TextField
                            label={"Nombre"}
                            variant="outlined"
                            value={usuario.name}
                            fullWidth={true}
                            onChange={(e) => setUsuario({...usuario, name: e.target.value})}
                        />

                        <TextField
                            label={"Username"}
                            variant="outlined"
                            value={usuario.username}
                            fullWidth={true}
                            onChange={(e) => setUsuario({...usuario, username: e.target.value})}
                        />

                        <TextField
                            label={"Email"}
                            variant="outlined"
                            value={usuario.email}
                            fullWidth={true}
                            onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                        />

                        <TextField
                            label={"Teléfono"}
                            variant="outlined"
                            value={usuario.phone}
                            fullWidth={true}
                            onChange={(e) => setUsuario({...usuario, phone: e.target.value})}
                        />

                        <TextField
                            label={"Sitio Web"}
                            variant="outlined"
                            value={usuario.website}
                            fullWidth={true}
                            onChange={(e) => setUsuario({...usuario, website: e.target.value})}
                        />

                        <CardActions sx={{justifyContent: "flex-start", px: 4, pb: 4}}>
                            <Button variant={"outlined"}
                                    color="primary"
                                    size="large"
                                    onClick={handleActualizar}>
                                Actualizar
                            </Button>

                            <Button
                                variant={"contained"}
                                color="primary"
                                size={"large"}
                                component={Link} to={"/usuarios"}
                            >
                                Regresar
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>


            </Box>
        </>
    )
}

export default Usuario;