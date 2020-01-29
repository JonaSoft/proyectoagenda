/*jshint esversion: 8 */
const mongoose = require('mongoose');
//conectando a base de datos
mongoose.connect('mongodb://localhost/notas', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('Conectado a base de datos'))
    .catch(err => console.err(err))