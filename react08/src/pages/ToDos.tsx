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
    Typography,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import type {ToDo} from "../models/ToDo.ts"


function ToDos() {
    const {id: userId} = useParams<{ id: string }>();
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [loading, setLoading] = useState(true);
    const [getId, setGetId] = useState('');
    // Definimos explícitamente los tipos, incluyendo completed y el id opcional
    const [newTodo, setNewTodo] = useState<{ title: string, completed: boolean, userId: number, id?: number }>({
        title: '',
        completed: false,
        userId: Number(userId) || 1
    });

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este todo?')) {
            axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
                .then(() => {
                    setTodos(todos.filter(todo => todo.id !== id));
                    alert('Todo eliminado correctamente');
                })
                .catch(e => {
                    console.log('Error al eliminar el todo', e);
                    alert('Error al eliminar el todo');
                });
        }
    };

    const handleGetById = () => {
        if (!getId) {
            alert('Por favor ingrese un ID');
            return;
        }
        axios.get<ToDo>(`https://jsonplaceholder.typicode.com/todos/${getId}`)
            .then(r => {
                // Populate the form with the retrieved todo data for editing
                setNewTodo({
                    title: r.data.title,
                    completed: r.data.completed,
                    userId: Number(userId) || 1, // Keep the current user's ID
                    id: r.data.id // Include the ID for PUT request
                });
                alert('Todo cargado en el formulario. Puede modificar y actualizar.');
            })
            .catch(e => {
                console.log('Error al obtener todo por ID', e);
                alert('Error al obtener el todo');
            });
    };

    const handleUpdateTodo = () => {
        // Basic validation
        if (!newTodo.title) {
            alert('Por favor complete el campo obligatorio (título)');
            return;
        }
        axios.put<ToDo>(`https://jsonplaceholder.typicode.com/todos/${newTodo.id}`, newTodo)
            .then(r => {
                alert(`Todo actualizado: ${JSON.stringify(r.data, null, 2)}`);
                // Refresh the todos list
                cargarTodos();
            })
            .catch(e => {
                console.log('Error al actualizar el todo', e);
                alert('Error al actualizar el todo');
            });
    };

    const handleCreateTodo = () => {
        // Basic validation
        if (!newTodo.title) {
            alert('Por favor complete el campo obligatorio (título)');
            return;
        }
        axios.post<ToDo>("https://jsonplaceholder.typicode.com/todos", newTodo)
            .then(r => {
                alert(`Todo creado: ${JSON.stringify(r.data, null, 2)}`);
                // Reset form
                setNewTodo({title: '', completed: false, userId: Number(userId) || 1});
                // Refresh the todos list
                cargarTodos();
            })
            .catch(e => {
                console.log('Error al crear todo', e);
                alert('Error al crear el todo');
            });
    };

    const cargarTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get<ToDo[]>(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.log("Error al cargar los todos del usuario", error);
            alert("Error al cargar los todos del usuario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            cargarTodos().then(r => console.log('ToDos cargados', r));
        }
    }, [userId])

    return (
        <>
            <Box sx={{mt: 3, p: 2, border: '1px solid grey', borderRadius: 2, bgcolor: 'white'}}>
                <Typography variant="h5" gutterBottom>
                    Buscar ToDo por ID
                </Typography>
                <TextField
                    label="ID del ToDo"
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
                    Crear Nuevo ToDo
                </Typography>
                <TextField
                    label="Título"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                    sx={{width: '100%', marginBottom: 2}}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newTodo.completed}
                            onChange={(e) => setNewTodo({...newTodo, completed: e.target.checked})}
                            color="primary"
                        />
                    }
                    label="Completado"
                    sx={{width: '100%', marginBottom: 2}}
                />
                <Typography variant="body2"
                            sx={{width: '100%', marginBottom: 2, p: 1, border: '1px solid grey', borderRadius: 1}}>
                    User ID: {newTodo.userId}
                </Typography>
                <Button variant="contained" color="success" onClick={handleCreateTodo} sx={{mt: 2}}>
                    Crear ToDo
                </Button>
                <Button variant="contained" color="warning" onClick={handleUpdateTodo} sx={{mt: 2, ml: 2}}>
                    Actualizar ToDo
                </Button>
            </Box>

            <Box sx={{maxWidth: 800, margin: "20px auto", px: 2}}>
                <Card variant="outlined" sx={{borderRadius: 3, p: 2}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2, p: 4}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>ToDos del Usuario</Typography>
                            <Typography variant={"caption"} color={"textSecondary"} sx={{fontWeight: "bold"}}>
                                <b>ID de Usuario: {userId}</b>
                            </Typography>
                        </Box>

                        {loading ? (
                            <Typography variant="h6">Cargando todos...</Typography>
                        ) : (
                            <Table sx={{mt: 2}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>ID</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Título</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Completado</TableCell>
                                        <TableCell sx={{color: "green", textAlign: "center"}}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {todos.map((todo) => (
                                        <TableRow key={todo.id}>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{todo.id}</TableCell>
                                            <TableCell sx={{color: "red", textAlign: "center"}}>{todo.title}</TableCell>
                                            <TableCell sx={{
                                                color: "red",
                                                textAlign: "center"
                                            }}>{todo.completed ? "Sí" : "No"}</TableCell>
                                            <TableCell sx={{textAlign: "center"}}>
                                                <Button color={"error"} variant={"contained"} sx={{ml: 1}}
                                                        onClick={() => handleDelete(todo.id)}>
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

export default ToDos;