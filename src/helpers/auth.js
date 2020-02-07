/*jshint esversion: 8 */
const helpers = {};
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // funcion de passport true o false (usuario logueado)
        return next(); //si esta logueado el usuario continua con otras funciones
    }
    //si usuario no sta logueado emite msg y redirecciona al signin
    req.flash('error_msg', 'Not authorized');
    res.redirect('/users/signin');
};
module.exports = helpers;