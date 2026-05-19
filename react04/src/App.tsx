import './App.css'

import {Link, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Concat from "./Pages/Concat.tsx";

function App() {

  return (
    <>
      <center>
        <nav>
          <Link to="/home">Home</Link>
          <br/>
          <Link to="/concat">Concat</Link>
        </nav>
      </center>

   <Routes>
     <Route path = "/home" element = {<Home/>}/>
     <Route path = "/concat" element = {<Concat/>}/>
   </Routes>

    </>
  )
}

export default App
