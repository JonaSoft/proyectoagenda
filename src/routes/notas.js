/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
router.get('/notas/add', (req, res) => {
    //res.send('Notes fronm databases');
    res.render('notas/new-note');
});

//para recibir datos del formulario en new-note.hbs
router.post('/notas/new-note', async(req, res) => {
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
        console.log(newNote);
        //res.send('OK');
        await newNote.save();
        req.flash('success_msg','Nota adicionada correctamente')
        res.redirect('/notas');
    }
});
router.get('/notas', async(req, res) => {
    //res.send('Notas from databases');
    let notas = await Note.find().sort({ date: 'desc' });
    //console.log(notas);
    //notas = JSON.parse(notas);
    res.render('notas/all-notes', { notas });
});
router.get('/notas/edit/:id',async(req,res)=>{
   let notas = await Note.findById(req.params.id);
   res.render('notas/edit-note',{notas})
});
router.put('/notas/edit-nota/:id',async(req,res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    
    res.redirect('/notas');
 });
router.delete('/notas/delete/:id',async(req,res)=>{
   console.log(req.params.id);
   await Note.findByIdAndDelete(req.params.id);
   req.flash('error_msg','Nota eliminada correctamente');
   res.redirect('/notas')
   //res.send(req.params.id)
})

module.exports = router;