# Desafío - FBI System

## Descripción
El FBI está abriendo un departamento de informática y te ha contratado para crear el sistema
online que gestione misiones secretas, necesitarás programar un servidor con Express que
utilice JWT para la autorización de agentes que visiten las páginas restringidas.
En este desafío contarás con un Apoyo Desafío - FBI System en donde encontrarás un
documento JavaScript que exporta un arreglo de objetos correspondiente a las credenciales
de los agentes secretos, además de una interfaz hecha con HTML y Bootstrap. Siéntete libre
de crear tu propia maqueta si así lo deseas, siempre y cuando cumplas con los
requerimientos.


## Requerimientos
1. Crear una ruta que autentique a un agente basado en sus credenciales y genere un
token con sus datos.
(3 Puntos)
2. Al autenticar un agente, devolver un HTML que:
a. Muestre el email del agente autorizado.
b. Guarde un token en SessionStorage con un tiempo de expiración de 2 minutos.
c. Disponibiliza un hiperenlace para redirigir al agente a una ruta restringida.
(4 Puntos)
3. Crear una ruta restringida que devuelva un mensaje de Bienvenida con el correo del
agente autorizado, en caso contrario devolver un estado HTTP que indique que el
usuario no está autorizado y un mensaje que menciona la descripción del error.
(3 Puntos)

## Instalación 🔧
1. Clona este repositorio.
2. Instala las dependencias por la terminal con npm:
- npm install
3. Inicia el servidor por la terminal:
- nodemon server

## Funcionalidades
- Autenticar a un agente con sus credenciales.
- Generar un token con JWT de 2 minutos de duración.
- Ingresar a una ruta restringida/protegida.
- Enviar mensajes de error segun corresponda.

## Tecnologías Utilizadas
- Node.js
- Express
- JWT


## Autor
- Danicsa Calderón - [GitHub](https://github.com/DaniCalderonM)

![giphy](https://github.com/DaniCalderonM/Desafio-FBISystem/assets/128839529/2842570a-2b24-4fff-9549-03a24376c349)
