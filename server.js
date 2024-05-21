const express = require('express')
const app = express()
const PORT = 3000;
const archivo = require('./data/agentes.js')
const agentes = archivo.results;
const jwt = require('jsonwebtoken')

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

const secretKey = "claveUltraMegaSecreta"
// 1. Crear una ruta que autentique a un agente basado en sus credenciales y genere un
// token con sus datos.
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
app.get("/SignIn", (req, res) => {

    const { email, password } = req.query
    console.log("req.query recibido desde el front: ", req.query)
    if (!email || !password) {
        console.log("status 400: Debe proporcionar un email y un password")
        return res.status(400).send("<h2>¡Debe proporcionar un email y un password!</h2>");
    }
    const agente = agentes.find((a) => a.email == email && a.password == password);
    const agenteEmail = agentes.find((a) => a.email == email);
    if (agente) {
        console.log("Agente con credenciales correctas")
        const token = jwt.sign(agente, secretKey, { expiresIn: '2m' });
        res.status(200).send(`
            <h1>Bienvenido, ${email}</h1>
            <a href="/restricted?token=${token}"> <p><b>Ir a la ruta **Restringida** &#128373;</b></p></a>
            <script>
                sessionStorage.setItem('token', '${token}')
            </script>`
        );
    } else if (agenteEmail == undefined) {
        console.log(`status 401: Este email ${email} de agente no existe`)
        return res.status(401).send("<h2>¡Este email no existe! Intente nuevamente</h2>");
    }
    else {
        console.log("status 401: Contraseña incorrecta")
        return res.status(401).send("<h2>¡Contraseña incorrecta! Intente nuevamente</h2>");
    }
});

// 3. Crear una ruta restringida que devuelva un mensaje de Bienvenida con el correo del
// agente autorizado, en caso contrario devolver un estado HTTP que indique que el
// usuario no está autorizado y un mensaje que menciona la descripción del error.
app.get('/restricted', (req, res) => {
    console.log("Agente ingreso a la ruta Restringida")
    const token = req.query.token;
    if (!token) {
        return res.status(401).send("No hay token, no esta Autorizado");
    } else {
        jwt.verify(token, secretKey, (err, data) => {
            console.log("Valor de Data: ", data);
            err ?
                res.status(403).send(`<h1>¡Usuario no autorizado!</h1>
                <p><b><u>Token inválido o ha expirado: ${err.message}</u></b></p>`)
                :
                res.status(200).send(`<h1>¡Bienvenido a la ruta restringida ${data.email}!</h1>`);
        });
    }
});


