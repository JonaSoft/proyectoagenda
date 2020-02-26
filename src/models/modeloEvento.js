const mongoose = require('mongoose');

const Schema = mongoose.Schema

let UserSchema = new Schema({
  //id: { type: Number, required: true, unique: true},
  title: { type: String, required: true },
  allDay: { type: Boolean},
  start:{ type:Date, required:true },
  end:{ type:Date, required:false },  
  email: { type: String, required: true }
}, 
  { collection : 'eventos' })


let UserModel = mongoose.model('eventos', UserSchema)

module.exports = UserModel
