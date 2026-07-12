import { useState } from "react";

function Videojuegos() {
  const videojuegos = [
  {
    id: 1,
    nombre: "Elden Ring",
    imagen:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    plataforma: "PS5",
    categoria: "Acción / RPG",
    precio: 1299,
    estado: "Activo",
    stock: 15,
  },
  {
    id: 2,
    nombre: "God of War Ragnarök",
    imagen:
      "https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg",
    plataforma: "PS5",
    categoria: "Acción / Aventura",
    precio: 1500,
    estado: "Activo",
    stock: 8,
  },
  {
    id: 3,
    nombre: "EA Sports FC 26",
    imagen:
      "https://tse4.mm.bing.net/th/id/OIP.g8eu7P8xRQXjKu6K2pywVgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    plataforma: "Xbox",
    categoria: "Deportes",
    precio: 999,
    estado: "Activo",
    stock: 22,
  },
  {
    id: 4,
    nombre: "Pokémon Legends: Arceus",
    imagen:
     "https://newzoo.com/wp-content/uploads/api/games/artworks/game--pokemon-legends-arceus.jpg",
    plataforma: "Nintendo Switch",
    categoria: "Aventura",
    precio: 1299,
    estado: "Agotado",
    stock: 0,
  },
  {
    id: 5,
    nombre: "Assassin's Creed Mirage",
    imagen:
      "https://cdn.akamai.steamstatic.com/steam/apps/3035570/header.jpg",
    plataforma: "PC",
    categoria: "Acción / Aventura",
    precio: 899,
    estado: "Activo",
    stock: 28,
  },
];

  const [busqueda, setBusqueda] = useState("");
  const [plataforma, setPlataforma] = useState("todas");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState("todos");

  const videojuegosFiltrados = videojuegos.filter((videojuego) => {
    const coincideNombre = videojuego.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincidePlataforma =
      plataforma === "todas" ||
      videojuego.plataforma === plataforma;

    const coincideCategoria =
      categoria === "todas" ||
      videojuego.categoria.includes(categoria);

    const coincideEstado =
      estado === "todos" ||
      videojuego.estado === estado;

    return (
      coincideNombre &&
      coincidePlataforma &&
      coincideCategoria &&
      coincideEstado
    );
  });

  const limpiarFiltros = () => {
    setBusqueda("");
    setPlataforma("todas");
    setCategoria("todas");
    setEstado("todos");
  };

  return (
    <section className="videojuegos-pagina">
      <div className="videojuegos-encabezado">
        <div>
          <h2>Gestión de videojuegos</h2>
          <p>Inicio &gt; Videojuegos</p>
        </div>

        <button
          className="boton-agregar-videojuego"
          type="button"
        >
          + Agregar videojuego
        </button>
      </div>

      <section className="videojuegos-filtros">
        <input
          type="text"
          placeholder="Buscar videojuego..."
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />

        <select
          value={plataforma}
          onChange={(evento) =>
            setPlataforma(evento.target.value)
          }
        >
          <option value="todas">
            Todas las plataformas
          </option>

          <option value="PS5">PS5</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo Switch">
            Nintendo Switch
          </option>
          <option value="PC">PC</option>
        </select>

        <select
          value={categoria}
          onChange={(evento) =>
            setCategoria(evento.target.value)
          }
        >
          <option value="todas">
            Todas las categorías
          </option>

          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="Deportes">Deportes</option>
          <option value="RPG">RPG</option>
        </select>

        <select
          value={estado}
          onChange={(evento) =>
            setEstado(evento.target.value)
          }
        >
          <option value="todos">
            Todos los estados
          </option>

          <option value="Activo">Activo</option>
          <option value="Agotado">Agotado</option>
        </select>

        <button
          className="boton-limpiar"
          type="button"
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </button>
      </section>

      <section className="videojuegos-tabla-tarjeta">
        <div className="tabla-contenedor">
          <table className="tabla-videojuegos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Plataforma</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {videojuegosFiltrados.length > 0 ? (
                videojuegosFiltrados.map((videojuego) => (
                  <tr key={videojuego.id}>
                    <td>{videojuego.id}</td>

                    <td>
                      <img
                        className="imagen-videojuego"
                        src={videojuego.imagen}
                        alt={`Portada de ${videojuego.nombre}`}
                      />
                    </td>

                    <td className="nombre-videojuego">
                      {videojuego.nombre}
                    </td>

                    <td>{videojuego.plataforma}</td>
                    <td>{videojuego.categoria}</td>

                    <td>
                      ${videojuego.precio.toLocaleString("es-MX")}
                    </td>

                    <td>
                      <span
                        className={
                          videojuego.estado === "Activo"
                            ? "estado estado-activo"
                            : "estado estado-agotado"
                        }
                      >
                        {videojuego.estado}
                      </span>
                    </td>

                    <td>{videojuego.stock}</td>

                    <td>
                      <div className="acciones-videojuego">
                        <button
                          className="boton-accion boton-editar"
                          type="button"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        <button
                          className="boton-accion boton-eliminar"
                          type="button"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="sin-resultados"
                    colSpan="9"
                  >
                    No se encontraron videojuegos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="paginacion">
          <div className="registros-pagina">
            <span>Mostrar</span>

            <select defaultValue="5">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>

            <span>registros por página</span>
          </div>

          <span className="texto-paginacion">
            Mostrando 1 a {videojuegosFiltrados.length} de 42 registros
          </span>

          <div className="paginas">
            <button type="button">‹</button>

            <button
              className="pagina-activa"
              type="button"
            >
              1
            </button>

            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">4</button>
            <button type="button">5</button>
            <button type="button">›</button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Videojuegos;