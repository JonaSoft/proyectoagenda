/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send('Index');
    res.render('index');
});
router.get('/about', (req, res) => {
    //res.send('about');
    res.render('about');
});

router.get('/calendar',(req,res)=>{
    res.render('calendar/calendar');
    //res.send('calendario');
    console.log('calendario')
})
router.get('/calendar/all',(req,res)=>{
    res.render('calendar/calendar');
    //res.send('calendario');
    console.log('calendario todos los eventos');
})
module.exports = router;