import {AppBar, Button, createTheme, ThemeProvider, Toolbar, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
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
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" sx={{mr: 'auto'}}>
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
                                 startIcon={<BookmarkIcon/>}>
                                 Publicaciones
                             </Button>
                             <Button
                                 color="inherit"
                                 component={Link} to={"/usuarios"}
                                 startIcon={<PersonIcon/>}>
                                 Usuarios
                             </Button>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            }
        </>
    )
}

export default NavBar;