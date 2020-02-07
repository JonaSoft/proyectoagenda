/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    //res.send('User ingresando a la app');
    res.render('users/signin');
});
// desde esta ruta se debe autenticar al usuario
// por defecto el nombre de autenticacion a usar es 'local'
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notas', // si autenticacion es ok pasar a /notas
    failureRedirect: '/users/signin', //sino continuar o enviar al /user/signin
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    //res.send('Formulario de autenticacion');
    res.render('users/signup');
});
router.post('/users/signup', async(req, res) => {
    //console.log(req.body);
    //res.send(req.body)
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'You need insert your name' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Password not must be at least or equal 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
        req.flash('error_msg', 'Datos de cuenta incorrectos');
        console.log(errors);
    } else {
        //res.send(req.body);
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            console.log('Usuario ya existe')
            req.flash('error_msg', 'The email is already  in use');
            res.redirect('/users/signup');
            return;
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }
    }
});
router.get('/users/logout', (req, res) => {
    req.logout(); // metodo de passport
    res.redirect('/');
})
module.exports = router;