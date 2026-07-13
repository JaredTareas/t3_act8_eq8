import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
function Videojuegos() {
  // 1. LEER LA URL Y PREPARAR ESTADOS
  // Esto cumple el requisito de que la página y límite se vean en la URL (?page=2&limit=20)
  const parametrosUrl = new URLSearchParams(window.location.search);
  const paginaInicial = Number(parametrosUrl.get("page")) || 1;
  const limiteInicial = Number(parametrosUrl.get("limit")) || 10;

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Estados para la paginación y filtros
  const [pagina, setPagina] = useState(paginaInicial);
  const [limite, setLimite] = useState(limiteInicial);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  // 2. OBTENER LOS DATOS DE LA API
  // El useEffect se activa cada vez que cambia la página, el límite o lo que escribimos en buscar
  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError(null);

      try {
        // DummyJSON usa "skip" para saltar registros (ej. página 2 con límite de 10, salta 10)
        const saltar = (pagina - 1) * limite;
        
        // Armamos la URL normal
        let url = `https://dummyjson.com/products?limit=${limite}&skip=${saltar}`;
        
        // Si hay algo escrito en el buscador, cambiamos la URL al endpoint de búsqueda
        if (busqueda !== "") {
          url = `https://dummyjson.com/products/search?q=${busqueda}&limit=${limite}&skip=${saltar}`;
        }

        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al descargar los productos");
        
        const datos = await respuesta.json();
        setProductos(datos.products);
        setTotal(datos.total);

        // Aquí hacemos el truco para actualizar la URL del navegador sin recargar la página
        window.history.pushState(null, "", `?page=${pagina}&limit=${limite}`);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [pagina, limite, busqueda]); 

  // Filtro extra: Filtramos localmente por categoría lo que ya nos trajo la API
  const productosFiltrados = productos.filter((prod) => {
    if (categoria === "todas") return true;
    return prod.category === categoria;
  });

  // 3. FUNCIONES CRUD SIMULADAS
  
  const agregarProducto = async () => {
    // 1. Usamos 'html' para dibujar varios inputs dentro de la alerta
    const { value: formValues } = await Swal.fire({
      title: 'Agregar nuevo producto',
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
      // preConfirm se ejecuta antes de cerrar para leer los valores de los inputs
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

    // Si el usuario cancela o deja el nombre vacío, cancelamos la acción
    if (!formValues || !formValues.nombre) return; 

    try {
      const respuesta = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formValues.nombre,
          price: Number(formValues.precio) || 0, // Convertimos a número
          category: formValues.categoria || 'Sin categoría',
          stock: Number(formValues.stock) || 0,
          // Si no ponen imagen, ponemos una de relleno para que no se vea el cuadro roto
          thumbnail: formValues.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen'
        })
      });
      const nuevoProducto = await respuesta.json();
      
      setProductos([nuevoProducto, ...productos]);
      
      Swal.fire('¡Éxito!', 'El registro fue agregado (Simulado)', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al agregar', 'error');
    }
  };

  const editarProducto = async (producto) => {
    // Es igual que agregar, pero le inyectamos los valores actuales (value="...") a los inputs
    const { value: formValues } = await Swal.fire({
      title: 'Editar producto',
      html: `
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Nombre:</label>
        <input id="swal-nombre" class="swal2-input" value="${producto.title}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Precio:</label>
        <input id="swal-precio" class="swal2-input" type="number" value="${producto.price}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Categoría:</label>
        <input id="swal-categoria" class="swal2-input" value="${producto.category}">
        
        <label style="font-size: 14px; text-align: left; display: block; margin-top: 10px;">Stock:</label>
        <input id="swal-stock" class="swal2-input" type="number" value="${producto.stock}">
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
          stock: document.getElementById('swal-stock').value
        }
      }
    });

    if (!formValues || !formValues.nombre) return;

    try {
      const respuesta = await fetch(`https://dummyjson.com/products/${producto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: formValues.nombre,
          price: Number(formValues.precio),
          category: formValues.categoria,
          stock: Number(formValues.stock)
        })
      });
      const prodActualizado = await respuesta.json();

      // Mapeamos para actualizar todos los campos modificados en la tabla visualmente
      const nuevosProductos = productos.map(p => 
        p.id === producto.id ? { 
          ...p, 
          title: prodActualizado.title,
          price: prodActualizado.price,
          category: prodActualizado.category,
          stock: prodActualizado.stock
        } : p
      );
      setProductos(nuevosProductos);
      
      Swal.fire('¡Actualizado!', 'El registro fue editado (Simulado)', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al editar', 'error');
    }
  };

  const eliminarProducto = async (id) => {
    // 1. Alerta de advertencia para confirmar
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

    // 2. Si le dio a cancelar, nos salimos
    if (!resultado.isConfirmed) return;

    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });

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
          <h2>Gestión de Productos (API DummyJSON)</h2>
          <p>Inicio &gt; Productos</p>
        </div>

        <button className="boton-agregar-videojuego" type="button" onClick={agregarProducto}>
          + Agregar registro
        </button>
      </div>

      <section className="videojuegos-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(evento) => {
            setBusqueda(evento.target.value);
            setPagina(1); // Si busca algo, lo mandamos a la primera página
          }}
        />

        <select
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          <option value="beauty">Belleza</option>
          <option value="fragrances">Fragancias</option>
          <option value="furniture">Muebles</option>
          <option value="groceries">Despensa</option>
        </select>

        <button className="boton-limpiar" type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </section>

      <section className="videojuegos-tabla-tarjeta">
        
        {/* Mostramos mensaje de carga o error */}
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
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        <div className="paginacion">
          <div className="registros-pagina">
            <span>Mostrar</span>
            <select 
              value={limite} 
              onChange={(e) => {
                setLimite(Number(e.target.value));
                setPagina(1); // Reiniciar a pag 1 si cambia el límite
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