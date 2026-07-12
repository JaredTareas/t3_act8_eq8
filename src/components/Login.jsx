import { useState } from "react";
import logoGameWolf from "../assets/logo-gamewolf.png";

function Login({ iniciarSesion }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setMensaje("");

    if (usuario.trim() === "" && password.trim() === "") {
      setMensaje("Escribe tu usuario y contraseña.");
      return;
    }

    if (usuario.trim() === "") {
      setMensaje("El usuario es obligatorio.");
      return;
    }

    if (password.trim() === "") {
      setMensaje("La contraseña es obligatoria.");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "https://dummyjson.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usuario.trim(),
            password: password,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje("Usuario o contraseña incorrectos.");
        return;
      }

      iniciarSesion(datos);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-pagina">
      <section
        className="login-portada"
        aria-label="Portada de GameWolf"
      ></section>

      <section className="login-contenedor">
        <form className="login-tarjeta" onSubmit={manejarEnvio}>
          <img
            className="login-logo"
            src={logoGameWolf}
            alt="Logo de GameWolf"
          />

          <h1 className="login-titulo">GameWolf</h1>

          <h2 className="login-bienvenida">Bienvenido</h2>

          <p className="login-descripcion">
            Ingresa tus datos para acceder al sistema
          </p>

          <div className="campo-grupo">
            <label htmlFor="usuario">
              Usuario de acceso:
            </label>

            <div className="campo-con-icono">
              <span className="campo-icono usuario-icono">
                👤
              </span>

              <input
                id="usuario"
                type="text"
                placeholder="Ejemplo: emilys"
                value={usuario}
                onChange={(evento) =>
                  setUsuario(evento.target.value)
                }
                autoComplete="username"
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label htmlFor="password">
              Contraseña:
            </label>

            <div className="campo-con-icono">
              <span className="campo-icono">🔒</span>

              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(evento) =>
                  setPassword(evento.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="boton-ojo"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {mensaje && (
            <div className="mensaje-error">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="boton-entrar"
            disabled={cargando}
          >
            {cargando ? "Ingresando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="olvidaste-password"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <div className="datos-prueba">
            <span>Datos para probar:</span>

            <strong>
              emilys / emilyspass
            </strong>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;