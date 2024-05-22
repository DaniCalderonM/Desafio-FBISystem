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

const secretKey = "claveUltraMegaSecreta";
const btn = `<p><button><a href="http://localhost:3000/">Volver al inicio</a></button></p>`;
const mib = `<img src="https://s3.us-west-2.amazonaws.com/s3.laprensa.com.ni-bq/wp-content/uploads/2017/09/29160805/men-in-black.jpg" width="400" height="300"></img>`;

// 1. Crear una ruta que autentique a un agente basado en sus credenciales y genere un
// token con sus datos.
app.get("/", (req, res) => {
    try {
        console.log("Archivo html obtenido correctamente");
        return res.sendFile(__dirname + '/index.html');
    } catch (error) {
        console.log("Error del servidor: ", error.message);
        return res.status(500).send(`
        <h1>Error interno del servidor: ${error.message} </h1>
        ${btn}`);
    }
});

// 2. Al autenticar un agente, devolver un HTML que:
// a. Muestre el email del agente autorizado.
// b. Guarde un token en SessionStorage con un tiempo de expiración de 2 minutos.
// c. Disponibiliza un hiperenlace para redirigir al agente a una ruta restringida.
app.get("/SignIn", (req, res) => {
    try {
        const { email, password } = req.query
        console.log("req.query recibido desde el front: ", req.query)
        if (!email || !password) {
            console.log("status 400: Debe proporcionar un email y un password")
            return res.status(400).send(`
        <h1>¡Debe proporcionar un email y un password!</h1>
        ${btn}`);
        }
        const agente = agentes.find((a) => a.email == email && a.password == password);
        const agenteEmail = agentes.find((a) => a.email == email);
        if (agente) {
            console.log("Agente con credenciales correctas")
            const token = jwt.sign(agente, secretKey, { expiresIn: '2m' });
            console.log("Valor variable token ruta SignIn: " + token);
            res.status(200).send(`
            <h1>Bienvenido, ${email}</h1>
            <a href="/restricted?token=${token}"> <h2><b>Ir a la ruta **Restringida** &#128373;</b></h2></a>
            <script>
                sessionStorage.setItem('token', '${token}')
            </script>`
            );
        } else if (agenteEmail == undefined) {
            console.log(`status 401: Este email ${email} de agente no existe`)
            return res.status(401).send(`
        <h1>¡Este email no existe! Intente nuevamente</h1>
        ${btn}`);
        }
        else {
            console.log("status 401: Contraseña incorrecta")
            return res.status(401).send(`
        <h1>¡Contraseña incorrecta! Intente nuevamente</h1>
        ${btn}`);
        }
    } catch (error) {
        console.log("Error del servidor: ", error.message);
        return res.status(500).send(`
        <h1>Error interno del servidor: ${error.message} </h1>
        ${btn}`);
    }
});

// 3. Crear una ruta restringida que devuelva un mensaje de Bienvenida con el correo del
// agente autorizado, en caso contrario devolver un estado HTTP que indique que el
// usuario no está autorizado y un mensaje que menciona la descripción del error.
app.get('/restricted', (req, res) => {
    try {
        console.log("Agente ingreso a la ruta Restringida")
        const token = req.query.token;
        console.log("Valor variable token ruta restricted: " + token);
        if (!token) {
            return res.status(401).send(`
        <h1>¡No hay token, no esta Autorizado!</h1>
        ${btn}`);
        } else {
            jwt.verify(token, secretKey, (err, data) => {
                console.log("Valor de Data: ", data);
                if (err) {
                    console.log("valor de err: " + err)
                    if (err.name == 'TokenExpiredError') {
                        // Token expirado
                        return res.status(403).send(`
                    <h1>¡Usuario no autorizado! - Acceso Denegado</h1>
                    <p><b><u>El token ha expirado: ${err.message} (${err.expiredAt.toString().slice(16, 24)} hrs)</u></b></p>
                    ${mib}
                    ${btn}`);
                    } else {
                        // Token invalido
                        return res.status(403).send(`
                    <h1>¡Usuario no autorizado! - Acceso Denegado</h1>
                    <p><b><u>El token es invalido: ${err.message}</u></b></p>
                    ${mib}
                    ${btn}`);
                    }
                } else {
                    console.log("Valor de Data: ", data);
                    res.status(200).send(`
                <h1>¡Bienvenido a la ruta restringida ${data.email}!</h1>
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Seal_of_the_Federal_Bureau_of_Investigation.svg" width="300" height="250">
                ${btn}`);
                }
            });
        }
    } catch (error) {
        console.log("Error del servidor: ", error.message);
        return res.status(500).send(`
        <h1>Error interno del servidor: ${error.message} </h1>
        ${btn}`);
    }
});