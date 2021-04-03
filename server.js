//punto de entrada a nuestra app
const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 8000;

app.use(session({ secret: 'tupalabrasecreta' }));
app.use(flash());
//anteponer /static a todos nuestros archivos de estilo y js
app.use('/static', express.static('static'))
    // sin anteponer /static v
    //app.use(express.static(_dirname + "/static"));

//para el uso de variables POST en req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

// importar las rutas
app.use(require('./routes/auth'));
app.use(require('./routes/routes'));


//lanzamos nuestra app
//guardamos en varialble server
const server = app.listen(port, function() {
    console.log('Escuchando en el puerto ' + port);
});


//Ahora creamos nuestras funciones de Sockets 
//npm install --save socket.io
const io = require('socket.io')(server);

// cuando me conecte con algún cliente
io.on('connection', function(socket) {
    // le mando información con el código "saludo_s"
    socket.emit('saludo_s', { msg: 'El servidor te manda un cordial saludo!' });

    // espero información desde el cliente
    socket.on('respuesta_s', function(data) {
        console.log(data);
    });
});