import './App.css'
import NavBar from "../components/NavBar.tsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Posts from "./pages/Posts.tsx";
import PostDetalle from "./pages/PostDetalle.tsx";

function App() {

  return (
    <>
      <NavBar/>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/posts" element={<Posts/>} />
            <Route path="/posts/:id" element={<PostDetalle/>} />
        </Routes>
    </>
  )
}

export default App
