// 1. Crear una ruta que autentique a un agente basado en sus credenciales y genere un
// token con sus datos.
const express = require('express')
const app = express()
const agentes = require('./data/agentes.js')
const jwt = require('jsonwebtoken')

app.use(express.json())

app.listen(3000, () => console.log('Your app listening on port 3000'))
const secretKey = "superClave"

app.get("/", (req, res) => {
    try {
        console.log("Archivo html obtenido correctamente");
        return res.sendFile(__dirname + '/index.html');
    } catch (error) {
        console.log("Error del servidor: ", error.message);
        return res.status(500).send({ message: "Error interno del servidor: " + error.message });
    }
});
// 2. Al autenticar un agente, devolver un HTML que:
// a. Muestre el email del agente autorizado.
// b. Guarde un token en SessionStorage con un tiempo de expiración de 2 minutos.
// c. Disponibiliza un hiperenlace para redirigir al agente a una ruta restringida.




// 3. Crear una ruta restringida que devuelva un mensaje de Bienvenida con el correo del
// agente autorizado, en caso contrario devolver un estado HTTP que indique que el
// usuario no está autorizado y un mensaje que menciona la descripción del error.
