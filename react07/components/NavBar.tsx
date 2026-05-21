import {AppBar, Button, createTheme, ThemeProvider, Toolbar, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {Link} from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

function NavBar() {
    return (
        <>
            {
                <ThemeProvider theme={darkTheme}>
                    {/*barra en estilo estatico*/}
                    <AppBar position="static">
                        {/*contenedor a modo de fila para organizar elementos*/}
                        <Toolbar>
                            {/*sx: css inline*/}
                            {/*flexGrow: My App es un h6 que crece hacia la derecha*/}
                            {/*        ocupando todo el espacio disponible, los elementos*/}
                            {/*        que se agreguen a continuacion se alinearán a la*/}
                            {/*        derecha*/}
                            <Typography variant="h6" sx={{flexGrow: 1}}>
                                My App
                            </Typography>
                            <Button
                                color="inherit"
                                component={Link} to={"/"}
                                startIcon={<HomeIcon/>}>
                                Inicio
                            </Button>
                            <Button
                                color="inherit"
                                component={Link} to={"/about"}
                                startIcon={<InfoIcon/>}
                            >
                                Acerca de
                            </Button>
                            <Button
                                color="inherit"
                                component={Link} to={"/posts"}
                                startIcon={<BookmarkIcon/>}
                            >
                                Publicaciones
                            </Button>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            }
        </>
    )
}

export default NavBar;