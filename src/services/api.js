export const obtenerProductosApi = async (pagina, limite, busqueda) => {
  const paginaCheapShark = pagina - 1;
  
  let url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${paginaCheapShark}&pageSize=${limite}`;
  
  if (busqueda !== "") {
    url += `&title=${busqueda}`;
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Error al descargar los videojuegos");
  
  const datosCheapShark = await respuesta.json();

  const categoriasFalsas = ["Acción", "Aventura", "Deportes", "RPG"];
  
  const productosDisfrazados = datosCheapShark.map((juego, index) => {
    return {
      id: (pagina - 1) * limite + (index + 1), 
      title: juego.title,
      price: Number(juego.normalPrice),
      category: categoriasFalsas[juego.title.length % 4], 
      stock: 15, 
      thumbnail: juego.thumb 
    };
  });

  const totalPaginas = Number(respuesta.headers.get('x-total-page-count')) || 10;

  return {
    products: productosDisfrazados,
    total: totalPaginas * limite 
  };
};

export const agregarProductoApi = async (nuevoProducto) => {
  const respuesta = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoProducto)
  });
  return await respuesta.json();
};

export const editarProductoApi = async (id, datosActualizados) => {
  const respuesta = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados)
  });
  return await respuesta.json();
};

export const eliminarProductoApi = async (id) => {
  const respuesta = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'DELETE',
  });
  return await respuesta.json();
};

export const iniciarSesionApi = async (usuario, password) => {
  const respuesta = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usuario,
      password: password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  return datos;
};