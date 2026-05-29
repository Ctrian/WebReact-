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
import type {User} from "../models/User.ts"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {main: '#90caf9'},
        secondary: {main: '#f48fb1'}
    }
})

function Usuarios() {
    const url = "https://jsonplaceholder.typicode.com/users";
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [getId, setGetId] = useState('');
    const [newUser, setNewUser] = useState({name: '', username: '', email: '', phone: '', website: ''});

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            axios.delete(`${url}/${id}`)
                .then(() => {
                    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
                    alert('Usuario eliminado correctamente');
                })
                .catch(e => {
                    console.log('Error al eliminar el usuario', e);
                    alert('Error al eliminar el usuario');
                });
        }
    };

    const handleGetById = () => {
        if (!getId) {
            alert('Por favor ingrese un ID');
            return;
        }
        axios.get<User>(`${url}/${getId}`)
            .then(r => {
                alert(`Usuario encontrado: ${JSON.stringify(r.data, null, 2)}`);
            })
            .catch(e => {
                console.log('Error al obtener usuario por ID', e);
                alert('Error al obtener el usuario');
            });
    };

    const handleCreateUser = () => {
        // Basic validation
        if (!newUser.name || !newUser.username || !newUser.email) {
            alert('Por favor complete los campos obligatorios (nombre, username, email)');
            return;
        }
        axios.post<User>(url, newUser)
            .then(r => {
                alert(`Usuario creado: ${JSON.stringify(r.data, null, 2)}`);
                // Reset form
                setNewUser({name: '', username: '', email: '', phone: '', website: ''});
            })
            .catch(e => {
                console.log('Error al crear usuario', e);
                alert('Error al crear el usuario');
            });
    };

    useEffect(() => {
        axios.get<User[]>(`${url}`)
            .then(r => {
                setUsuarios(r.data);
            })
            .catch(e => alert(
                e
            ))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Container sx={{mt: 4}}>
            <h4>Esta es la página de Usuarios</h4>
            <Typography variant="h4" gutterBottom>
                Usuarios
            </Typography>

            <Box sx={{mt: 3, p: 2, border: '1px solid grey', borderRadius: 2, bgcolor: 'white'}}>
                <Typography variant="h5" gutterBottom>
                    Buscar Usuario por ID
                </Typography>
                <TextField
                    label="ID del Usuario"
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
                    Crear Nuevo Usuario
                </Typography>
                <TextField
                    label="Nombre"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <TextField
                    label="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <TextField
                    label="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <TextField
                    label="Teléfono"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <TextField
                    label="Sitio Web"
                    value={newUser.website}
                    onChange={(e) => setNewUser({...newUser, website: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <Button variant="contained" color="success" onClick={handleCreateUser} sx={{mt: 2}}>
                    Crear Usuario
                </Button>
            </Box>

            {loading ? (
                <Typography variant="h6">Cargando usuarios...</Typography>
            ) : <ThemeProvider theme={darkTheme}>
                <Table sx={{mt: 2}}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Nombre</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Email</TableCell>
                            <TableCell sx={{color: "green", textAlign: "center"}}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{usuario.id}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{usuario.name}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>{usuario.email}</TableCell>
                                <TableCell sx={{color: "red", textAlign: "center"}}>
                                    <Button color={"secondary"} variant={"outlined"} component={Link}
                                            to={`/usuarios/${usuario.id}`}>
                                        Ver Detalle
                                    </Button>
                                    <Button color={"error"} variant={"contained"} sx={{ml: 1}}
                                            onClick={() => handleDelete(usuario.id)}>
                                        Eliminar
                                    </Button>
                                     <Button color={"error"} variant={"outlined"} sx={{ml: 1}}
                                             component={Link} to={`/usuarios/${usuario.id}/posts`}>
                                         Posts
                                     </Button>
                                     <Button color={"error"} variant={"contained"} sx={{ml: 1}}
                                             component={Link} to={`/usuarios/${usuario.id}/todos`}>
                                         ToDos
                                     </Button>
                                     <Button color={"error"} variant={"outlined"} sx={{ml: 1}}
                                             component={Link} to={`/usuarios/${usuario.id}/albums`}>
                                         Albums
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

export default Usuarios;