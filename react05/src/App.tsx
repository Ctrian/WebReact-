import './App.css'
import Form1 from "./pages/Form1.tsx";
import Form2 from "./pages/From2.tsx";
import {Route, Routes} from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Form1/>}/>
        <Route path="/form2" element={<Form2/>}/>
      </Routes>
    </>
  )
}

export default App
