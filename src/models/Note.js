/*jshint esversion: 8 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    //guarda en user el id de usuario al momento de grabar nueva nota
    user: { type: String }
});
module.exports = mongoose.model('Note', NoteSchema)