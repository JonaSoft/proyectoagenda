/*jshint esversion:8*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//definir nueva estrategia de autenticación con metodo passport
passport.use(new LocalStrategy({
    // a través de que valor se va a autenticar el usuario,
    // en este caso email y password
    usernameField: 'email'
        // ejecuta funcion para validar el dato usernameField
        // en la funcion recibimos email, password y un
        //callback para culminar con la autenticación 
}, async(email, password, done) => {
    //busca por medio del modelo de usuario el email 
    //en la base de datos
    const user = await User.findOne({ email: email });
    console.log('de passport', user)
    if (!user) {
        //si no existe el user ejecuta callback done
        //para terminar con el proceso de autenticación
        return done(null, false, { message: 'Not user found' });
        //devuelve null para errors, sin user y un  mensaje
    } else {
        //console.log('usuarios desde passport',user)
        //si existe ejecuta metodo matchPassword de modelo User.js
        const match = await user.matchPassword(password);
        if (match) {
            // si match es true retorna en callback done 
            //null para el errors, el usuario encontrado
            //y sin mensaje
            return done(null, user);
        } else {
            //si es false null para errors, usuario false
            //y mensaje
            return done(null, false, { message: 'Incorrect Pasword' });
        }
    }
}));

//despues de autenticarse el usuario debe ser almacenado en una session
/////////////////////////////////////////////////////////////////////

//toma un usuario y toma un callback
passport.serializeUser((user, done) => {
    //ejecutamos el callback  con error null y  el id.usuario
    //cuando el usuario se autentica almacenamos el id del usuario en una
    //session para evitar loguearse cada vez que visita una pagina.
    done(null, user.id);
});
//toma un id.usuario y un callback (genera un usuario)
passport.deserializeUser((id, done) => {
    //busca en bdatos,si hay un usuario en la session, busca por id
    //ese usuario 
    User.findById(id, (err, user) => {
        //si encuentra id.usuario en la session retorno con el callback,
        //devuelvo un error si lo hay y el usuario(user)
        done(err, user);
    });
});
module.exports = passport