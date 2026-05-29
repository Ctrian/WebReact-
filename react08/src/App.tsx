import './App.css'
import NavBar from "./components/NavBar.tsx";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Posts from "./pages/Posts.tsx";
import PostDetalle from "./pages/PostDetalle.tsx";
import Usuarios from "./pages/Usuarios.tsx";
import Usuario from "./pages/Usuario.tsx";
import UsuarioPosts from "./pages/UsuarioPosts.tsx";
import ToDos from "./pages/ToDos.tsx";
import Albums from "./pages/Albums.tsx";

function App() {
    
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/posts" element={<Posts/>}/>
                <Route path="/posts/:id" element={<PostDetalle/>}/>
                <Route path="/usuarios" element={<Usuarios/>}/>
                <Route path="/usuarios/:id" element={<Usuario/>}/>
                <Route path="/usuarios/:id/posts" element={<UsuarioPosts/>}/>
                <Route path="/usuarios/:id/todos" element={<ToDos/>}/>
                <Route path="/usuarios/:id/albums" element={<Albums/>}/>
            </Routes>
        </>
    )
}

export default App
