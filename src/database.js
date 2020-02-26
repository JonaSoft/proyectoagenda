/*jshint esversion: 8 */
const mongoose = require('mongoose');
//conectando a base de datos
mongoose.connect('mongodb+srv://jonasoft:Yi8FBQscLZPF5MmW@cluster0-bw4ak.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
},
(err, res) => {
    if (err) throw err;
    console.log('Conectado a base de datos');
});

   