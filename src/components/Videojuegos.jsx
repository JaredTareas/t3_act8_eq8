import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { 
  obtenerProductosApi, 
  agregarProductoApi, 
  editarProductoApi, 
  eliminarProductoApi 
} from '../services/api';

function Videojuegos() {
  const parametrosUrl = new URLSearchParams(window.location.search);
  const paginaInicial = Number(parametrosUrl.get("page")) || 1;
  const limiteInicial = Number(parametrosUrl.get("limit")) || 10;

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const [pagina, setPagina] = useState(paginaInicial);
  const [limite, setLimite] = useState(limiteInicial);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerProductosApi(pagina, limite, busqueda);
        
        setProductos(datos.products);
        setTotal(datos.total);

        window.history.pushState(null, "", `?page=${pagina}&limit=${limite}`);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [pagina, limite, busqueda]); 

  const productosFiltrados = productos.filter((prod) => {
    if (categoria === "todas") return true;
    return prod.category === categoria;
  });
  
  const agregarProducto = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar nuevo videojuego',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre del juego">
        <input id="swal-precio" class="swal2-input" type="number" placeholder="Precio (ej. 1299)">
        <input id="swal-categoria" class="swal2-input" placeholder="Categoría (ej. RPG)">
        <input id="swal-stock" class="swal2-input" type="number" placeholder="Stock (ej. 15)">
        <input id="swal-imagen" class="swal2-input" placeholder="URL de la portada (opcional)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-nombre').value,
          precio: document.getElementById('swal-precio').value,
          categoria: document.getElementById('swal-categoria').value,
          stock: document.getElementById('swal-stock').value,
          imagen: document.getElementById('swal-imagen').value
        }
      }
    });

    if (!formValues || !formValues.nombre) return; 

    try {
      const datosNuevoProducto = {
        title: formValues.nombre,
        price: Number(formValues.precio) || 0,
        category: formValues.categoria || 'Sin categoría',
        stock: Number(formValues.stock) || 0,
        thumbnail: formValues.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen'
      };

      const nuevoProducto = await agregarProductoApi(datosNuevoProducto);
      
      setProductos([nuevoProducto, ...productos]);
      Swal.fire('¡Éxito!', 'El registro fue agregado (Simulado)', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al agregar', 'error');
    }
  };

  const editarProducto = async (producto) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar videojuego',
      html: `
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Nombre:</label>
        <input id="swal-nombre" class="swal2-input" value="${producto.title}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Precio:</label>
        <input id="swal-precio" class="swal2-input" type="number" value="${producto.price}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Categoría:</label>
        <input id="swal-categoria" class="swal2-input" value="${producto.category}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Stock:</label>
        <input id="swal-stock" class="swal2-input" type="number" value="${producto.stock}">

        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">URL de la Portada:</label>
        <input id="swal-imagen" class="swal2-input" value="${producto.thumbnail}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-nombre').value,
          precio: document.getElementById('swal-precio').value,
          categoria: document.getElementById('swal-categoria').value,
          stock: document.getElementById('swal-stock').value,
          imagen: document.getElementById('swal-imagen').value // Leemos la nueva imagen
        }
      }
    });

    if (!formValues || !formValues.nombre) return;

    try {
      const datosActualizados = { 
        title: formValues.nombre,
        price: Number(formValues.precio),
        category: formValues.categoria,
        stock: Number(formValues.stock),
        thumbnail: formValues.imagen // Lo mandamos en los datos actualizados
      };

      const prodActualizado = await editarProductoApi(producto.id, datosActualizados);

      const nuevosProductos = productos.map(p => 
        p.id === producto.id ? { 
          ...p, 
          title: prodActualizado.title,
          price: prodActualizado.price,
          category: prodActualizado.category,
          stock: prodActualizado.stock,
          thumbnail: formValues.imagen // Actualizamos la imagen en la tabla
        } : p
      );
      setProductos(nuevosProductos);
      
      Swal.fire('¡Actualizado!', 'El registro fue editado (Simulado)', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al editar', 'error');
    }
  };

  const eliminarProducto = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarProductoApi(id);

      const nuevosProductos = productos.filter(p => p.id !== id);
      setProductos(nuevosProductos);
      
      Swal.fire('¡Eliminado!', 'El registro ha sido eliminado (Simulado)', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("todas");
    setPagina(1);
  };

  return (
    <section className="videojuegos-pagina">
      <div className="videojuegos-encabezado">
        <div>
          <h2>Gestión de Videojuegos</h2>
          <p>Inicio &gt; Videojuegos</p>
        </div>

        <button className="boton-agregar-videojuego" type="button" onClick={agregarProducto}>
          + Agregar videojuego
        </button>
      </div>

      <section className="videojuegos-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(evento) => {
            setBusqueda(evento.target.value);
            setPagina(1); 
          }}
        />

        <select
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="Deportes">Deportes</option>
          <option value="RPG">RPG</option>
        </select>

        <button className="boton-limpiar" type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </section>

      <section className="videojuegos-tabla-tarjeta">
        
        {cargando && <p style={{ padding: '20px', textAlign: 'center' }}>Cargando datos desde la API...</p>}
        {error && <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>}

        {!cargando && !error && (
          <div className="tabla-contenedor">
            <table className="tabla-videojuegos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>
                        <img
                          className="imagen-videojuego"
                          src={producto.thumbnail}
                          alt={producto.title}
                          style={{ width: '120px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td className="nombre-videojuego">{producto.title}</td>
                      <td>{producto.category}</td>
                      <td>${producto.price}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <div className="acciones-videojuego">
                          <button
                            className="boton-accion boton-editar"
                            type="button"
                            title="Editar"
                            onClick={() => editarProducto(producto)}
                          >
                            ✏️
                          </button>
                          <button
                            className="boton-accion boton-eliminar"
                            type="button"
                            title="Eliminar"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="sin-resultados" colSpan="7">
                      No se encontraron videojuegos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="paginacion">
          <div className="registros-pagina">
            <span>Mostrar</span>
            <select 
              value={limite} 
              onChange={(e) => {
                setLimite(Number(e.target.value));
                setPagina(1); 
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <span>registros por página</span>
          </div>

          <span className="texto-paginacion">
            Total en la API: {total} registros
          </span>

          <div className="paginas">
            <button 
              type="button" 
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              ‹ Anterior
            </button>

            <button className="pagina-activa" type="button">
              {pagina}
            </button>

            <button 
              type="button" 
              disabled={pagina * limite >= total}
              onClick={() => setPagina(pagina + 1)}
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Videojuegos;