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
import type {Album} from "../models/Album.ts"


function Albums() {
    const {id: userId} = useParams<{ id: string }>();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [getId, setGetId] = useState('');
    const [newAlbum, setNewAlbum] = useState<{title: string, userId: number, id?: number}>({
        title: '',
        userId: Number(userId) || 1
    });

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este álbum?')) {
            axios.delete(`https://jsonplaceholder.typicode.com/albums/${id}`)
                .then(() => {
                    setAlbums(albums.filter(album => album.id !== id));
                    alert('Álbum eliminado correctamente');
                })
                .catch(e => {
                    console.log('Error al eliminar el álbum', e);
                    alert('Error al eliminar el álbum');
                });
        }
    };

    const handleGetById = () => {
        if (!getId) {
            alert('Por favor ingrese un ID');
            return;
        }
        axios.get<Album>(`https://jsonplaceholder.typicode.com/albums/${getId}`)
            .then(r => {
                // Populate the form with the retrieved album data for editing
                setNewAlbum({
                    title: r.data.title,
                    userId: Number(userId) || 1, // Keep the current user's ID
                    id: r.data.id // Include the ID for PUT request
                });
                alert('Álbum cargado en el formulario. Puede modificar y actualizar.');
            })
            .catch(e => {
                console.log('Error al obtener álbum por ID', e);
                alert('Error al obtener el álbum');
            });
    };

    const handleUpdateAlbum = () => {
        // Basic validation
        if (!newAlbum.title) {
            alert('Por favor complete el campo obligatorio (título)');
            return;
        }
        axios.put<Album>(`https://jsonplaceholder.typicode.com/albums/${newAlbum.id}`, newAlbum)
            .then(r => {
                alert(`Álbum actualizado: ${JSON.stringify(r.data, null, 2)}`);
                // Refresh the albums list
                cargarAlbums();
            })
            .catch(e => {
                console.log('Error al actualizar el álbum', e);
                alert('Error al actualizar el álbum');
            });
    };

    const handleCreateAlbum = () => {
        // Basic validation
        if (!newAlbum.title) {
            alert('Por favor complete el campo obligatorio (título)');
            return;
        }
        axios.post<Album>("https://jsonplaceholder.typicode.com/albums", newAlbum)
            .then(r => {
                alert(`Álbum creado: ${JSON.stringify(r.data, null, 2)}`);
                // Reset form
                setNewAlbum({title: '', userId: Number(userId) || 1});
                // Refresh the albums list
                cargarAlbums();
            })
            .catch(e => {
                console.log('Error al crear álbum', e);
                alert('Error al crear el álbum');
            });
    };

    const cargarAlbums = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Album[]>(`https://jsonplaceholder.typicode.com/users/${userId}/albums`);
            setAlbums(response.data);
        } catch (error) {
            console.log("Error al cargar los albums del usuario", error);
            alert("Error al cargar los albums del usuario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            cargarAlbums().then(() => console.log("Álbumes cargados con éxito"));
        }
    }, [userId])

    return (
        <>
            <Box sx={{mt: 3, p: 2, border: '1px solid grey', borderRadius: 2, bgcolor: 'white'}}>
                <Typography variant="h5" gutterBottom>
                    Buscar Álbum por ID
                </Typography>
                <TextField
                    label="ID del Álbum"
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
                    Crear Nuevo Álbum
                </Typography>
                <TextField
                    label="Título"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <Typography variant="body2" sx={{width: '100%', marginBottom: 2, p: 1, border: '1px solid grey', borderRadius: 1}}>
                    User ID: {newAlbum.userId}
                </Typography>
                <Button variant="contained" color="success" onClick={handleCreateAlbum} sx={{mt: 2}}>
                    Crear Álbum
                </Button>
                <Button variant="contained" color="warning" onClick={handleUpdateAlbum} sx={{mt: 2, ml: 2}}>
                    Actualizar Álbum
                </Button>
            </Box>

            <Box sx={{maxWidth: 800, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p: 4}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Álbumes del Usuario</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight: "bold"}}>
                                <b>ID de Usuario: {userId}</b>
                            </Typography>
                        </Box>

                        {loading ? (
                            <Typography variant="h6">Cargando álbumes...</Typography>
                        ) : (
                            <Table sx={{mt: 2}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Título</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {albums.map((album) => (
                                        <TableRow key={album.id}>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{album.id}</TableCell>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{album.title}</TableCell>

                                            <TableCell sx={{textAlign: "center"}}>
                                                <Button color={"error"} variant={"contained"} sx={{ml: 1}}
                                                        onClick={() => handleDelete(album.id)}>
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

export default Albums;