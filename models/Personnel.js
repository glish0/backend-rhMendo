const mongoose = require('mongoose')

const personnelSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  sexe: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String,
    required: true
  },
  poste: {
    type: String,
    required: true
  },
  domicile: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum:["stagiaire" , "employee"],
    required: true
  },

})

module.exports = mongoose.model('Personnel', personnelSchema)