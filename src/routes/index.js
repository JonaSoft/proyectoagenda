/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

const eventos = require('../models/modeloEvento');
const User = require('../config/passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', (req, res) => {

    res.render('users/signin');
});

router.get('/index', async(req, res) => {

    res.render('index');
});

router.get('/flights', (req, res) => {
    res.render('flights/flights');
});

router.get('/calendar', isAuthenticated, (req, res) => {
    res.render('calendar/calendar');

    console.log('calendario entro');

});

router.get(`/calendar/:usermail`, isAuthenticated, async(req, res) => {
    console.log('paso email', req.params.usermail);
    //console.log('pasa datos', req.body);
    //console.log('responde', res.user)
    /*await eventos.find({ email: 'carlosantonioucananbarrera@gmail.com' }).exec(function(err, doc) {
        if (err) {
            res.status(500)
            res.json(err)
        }
        res.json('responde form', doc)
        console.log(doc);
        console.log(req.params.usermail)
    })*/
    await eventos.find({ email: req.params.usermail }).exec(function(err, doc) {
        if (err) {
            res.status(500)
            res.json(err)
        }
        res.json(doc)
        console.log(doc);
        console.log(req.params.usermail)
    })

})

router.post('/calendar/delete/:eventId', isAuthenticated, async(req, res) => {
    console.log('entro para borrar', req.params.eventId);
    console.log(req.params)
    await eventos.deleteOne({ _id: req.params.eventId }).exec(function(err) {
        if (err) {
            res.json(err)
        }
        res.json("Evento eliminado");
    })
})


router.post('/calendar/new', isAuthenticated, async(req, res) => {
    await eventos.findOne({}).sort({ id: -1 }).exec(function(err, doc) {
        console.log('calendario un nuevo evento');
        const eventoNuevo = new eventos({
            title: req.body.title,
            allDay: req.body.allDay,
            start: req.body.start,
            end: req.body.end,
            email: req.body.usermail
        });
        console.log('evento nuevo ', eventoNuevo);
        eventoNuevo.save((err) => {
            if (err) {
                res.json(err)
            }
            res.json(eventoNuevo._id)
            console.log(eventoNuevo._id)
        });
    })
})
router.post('/calendar/update:idItem', isAuthenticated, async(req, res) => {
    console.log('Se ha actualizado el evento');
    console.log('datos1', req.body.id, 'datos2', req.body.start, 'datos3', req.body.end)
    await eventos.findByIdAndUpdate(req.body.id, { start: req.body.start, end: req.body.end }).then((rawResponse) => {
        console.log(rawResponse);
        res.send("Se ha actualizado el evento");
    }).catch((err) => {
        res.send("Ocurrio un error en la actualizacion");
    });
})
module.exports = router;