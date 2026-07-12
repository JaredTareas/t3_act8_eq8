import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const iniciarSesion = (datosUsuario) => {
    setUsuarioActivo(datosUsuario);
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
  };

  return (
    <>
      {usuarioActivo ? (
        <Dashboard
          usuario={usuarioActivo}
          cerrarSesion={cerrarSesion}
        />
      ) : (
        <Login iniciarSesion={iniciarSesion} />
      )}
    </>
  );
}

export default App;