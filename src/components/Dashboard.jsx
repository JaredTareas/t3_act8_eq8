import { useState } from "react";
import Videojuegos from "./Videojuegos";

function Dashboard({ usuario, cerrarSesion }) {
  const [vistaActual, setVistaActual] = useState("inicio");

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <button
            className={vistaActual === "inicio" ? "menu-activo" : ""}
            type="button"
            onClick={() => setVistaActual("inicio")}
          >
            <span>🏠</span>
            Inicio
          </button>

          <button
            className={vistaActual === "videojuegos" ? "menu-activo" : ""}
            type="button"
            onClick={() => setVistaActual("videojuegos")}
          >
            <span>🎮</span>
            Videojuegos
          </button>

          <button type="button">
            <span>🛒</span>
            Pedidos
          </button>

          <button type="button">
            <span>👥</span>
            Clientes
          </button>

          <button type="button">
            <span>🖥️</span>
            Plataformas
          </button>

          <button type="button">
            <span>📊</span>
            Reportes
          </button>
        </nav>

        <button
          className="cerrar-sesion"
          type="button"
          onClick={cerrarSesion}
        >
          <span>↪</span>
          Cerrar sesión
        </button>
      </aside>

      <section className="dashboard-contenido">
        <header className="dashboard-navbar">
          <h1>
            {vistaActual === "inicio"
              ? "Panel principal"
              : "Gestión de videojuegos"}
          </h1>

          <div className="navbar-usuario">
            <span className="campana">🔔</span>

            <img
              src={usuario.image}
              alt={`Foto de ${usuario.firstName}`}
            />

            <div className="datos-usuario">
              <strong>
                {usuario.firstName} {usuario.lastName}
              </strong>

              <span>Administrador</span>
            </div>
          </div>
        </header>

        {vistaActual === "inicio" ? (
          <section className="dashboard-principal">
            <div className="bienvenida">
              <h2>Bienvenido, {usuario.firstName}</h2>

              <p>
                Aquí tienes un resumen general de la tienda GameWolf.
              </p>
            </div>

            <section className="tarjetas-resumen">
              <article className="tarjeta-resumen">
                <span className="tarjeta-icono">🎮</span>

                <div>
                  <p>Videojuegos disponibles</p>
                  <strong>62</strong>
                </div>
              </article>

              <article className="tarjeta-resumen">
                <span className="tarjeta-icono icono-naranja">
                  🛍️
                </span>

                <div>
                  <p>Pedidos pendientes</p>
                  <strong className="numero-naranja">8</strong>
                </div>
              </article>

              <article className="tarjeta-resumen">
                <span className="tarjeta-icono">📊</span>

                <div>
                  <p>Ventas del mes</p>

                  <strong className="numero-verde">
                    $18,450
                  </strong>
                </div>
              </article>
            </section>

            <section className="pedidos-tarjeta">
              <h2>Últimos pedidos</h2>

              <div className="tabla-contenedor">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Videojuego</th>
                      <th>Plataforma</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Carlos García</td>
                      <td>Minecraft</td>
                      <td>Xbox</td>
                      <td>$599</td>

                      <td>
                        <span className="estado pagado">
                          Pagado
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>María López</td>
                      <td>Spider-Man 2</td>
                      <td>PS5</td>
                      <td>$1,300</td>

                      <td>
                        <span className="estado pendiente">
                          Pendiente
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>Pedro Díaz</td>
                      <td>FC 26</td>
                      <td>PC</td>
                      <td>$950</td>

                      <td>
                        <span className="estado pagado">
                          Pagado
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className="ver-pedidos" type="button">
                ☷ Ver todos los pedidos
              </button>
            </section>
          </section>
        ) : (
          <Videojuegos />
        )}
      </section>
    </main>
  );
}

export default Dashboard;