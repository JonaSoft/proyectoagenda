/*jshint esversion: 8 */
//OJO usar  "handlebars": "^4.5.3", en package.json para evitar
//los errores en el reconocimiento de variables
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
//Initialization
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
//para vistas hbs
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //obtener direccion
    //de /views y concatenar con carpeta /layouts
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares

app.use(bodyParser.urlencoded({ extended: false })); // configurar en el servidor
//para recibir solo datos, no imagenes
app.use(methodOverride('_method')); // para recibir desde los formularios
//con distintos metodos: PUT, DELETE, etc //configuraciones para autenticar
app.use(session({
    secret: 'mypasswordapp',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
//Global variables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notas'));
app.use(require('./routes/users'));


//Static Files

app.use(express.static(path.join(__dirname, 'public')));

//Server listenning

app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});