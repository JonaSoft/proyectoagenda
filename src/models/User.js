/*jshint esversion: 8 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcript = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
//metodo para encriptar
UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcript.genSalt(10); // genera un hash y aplica el algoritmo 10 veces
    const hash = bcript.hash(password, salt); // generacion de contraseña cifrada.
    return hash;
};
//metodo para comparar contraseña del usuario con la contraseña del modelo de datos
UserSchema.methods.matchPassword = function(password) {
    return bcript.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);