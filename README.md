### Euipo numero 8 
Garcia Garcia Luis Jared, Fuentes Lopez Leonardo

# GameWolf

Sistema administrativo para una tienda de videojuegos, desarrollado como parte de la actividad **T3_ACT8_EQ8** de la materia de Programación Web.

El proyecto permite iniciar sesión, visualizar un panel administrativo y consultar una tabla de videojuegos con opciones de búsqueda, paginación y operaciones simuladas de agregar, editar y eliminar productos.


##  Proyecto desplegado en VPS

El proyecto se encuentra publicado en el siguiente servidor:

[Ver proyecto GameWolf en la VPS](http://169.58.15.223/)


El sistema cuenta con:

- Formulario de inicio de sesión.
- Validación de campos.
- Autenticación simulada mediante una API.
- Dashboard principal.
- Menú lateral de navegación.
- Barra superior con los datos del usuario.
- Tabla de videojuegos.
- Buscador de videojuegos.
- Paginación.
- Modal para agregar y editar productos.
- Eliminación simulada de registros.
- Mensajes de éxito y error.
- Cierre de sesión.

---

## APIs utilizadas

### CheapShark API

Para obtener los datos que aparecen en la tabla de videojuegos se utilizó la API de CheapShark.

Esta API proporciona información como:

- Nombre del videojuego.
- Precio.
- Imagen.
- Ofertas disponibles.

Endpoint utilizado:

text
https://www.cheapshark.com/api/1.0/deals



DummyJSON API

También se utilizó DummyJSON para simular el inicio de sesión y las operaciones de productos.

Endpoint del login:

https://dummyjson.com/auth/login

Endpoints para productos:

https://dummyjson.com/products/add
https://dummyjson.com/products/{id}



