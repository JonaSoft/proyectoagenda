/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');


router.get('/notas/add', isAuthenticated, (req, res) => {
    //res.send('Notes from databases');
    res.render('notas/new-note');
});

//para recibir datos del formulario en new-note.hbs
router.post('/notas/new-note', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Must be write a Title' });
    }
    if (!description) {
        errors.push({ text: 'Must be write a Description' });
    }
    if (errors.length > 0) {
        res.render('notas/new-note', {
            errors,
            title,
            description
        });
    } else {
        //res.send('OK');
        // para grabar nota en base de datos
        const newNote = new Note({ title, description });
        //guarda en propiedad user el id del usuario, que es lo almacenado por passport
        //en req.user(que son todos los datos del usuario al momento de ser autenticado)
        newNote.user = req.user.id;
        console.log(newNote);
        //res.send('OK');
        await newNote.save();
        req.flash('success_msg', 'Nota adicionada correctamente');
        res.redirect('/notas');
    }
});
router.get('/notas', isAuthenticated, async(req, res) => {
    //res.send('Notas from databases');
    let notas = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
    //console.log(notas);
    //notas = JSON.parse(notas);
    res.render('notas/all-notes', { notas });
});
router.get('/notas/edit/:id', isAuthenticated, async(req, res) => {
    let notas = await Note.findById(req.params.id);
    res.render('notas/edit-note', { notas })
});
router.put('/notas/edit-nota/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Nota editada correctamente');
    res.redirect('/notas');
});
router.delete('/notas/delete/:id', isAuthenticated, async(req, res) => {
    console.log(req.params.id);
    await Note.findByIdAndDelete(req.params.id);
    req.flash('error_msg', 'Nota eliminada correctamente');
    res.redirect('/notas');
    //res.send(req.params.id)
})

module.exports = router;