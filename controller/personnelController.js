const Personnel = require('../models/Personnel')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { response } = require('express')

// @desc Get all personnel
// @route Get /personnel
// @access Private 

const getAllPersonnel = asyncHandler(async (req, res) => {
  const personnels = await Personnel.find().lean()
  if (!personnels?.length) {
    return res.status(400).json({ message: 'Aucun Personnels trouves ' })
  }
  res.json(personnels)
})

// @desc Create new personnel
// @route POST /personnel
// @access Private 

const createnewPersonnel = asyncHandler(async (req, res) => {
  const { nom, prenom, sexe, email, telephone, poste, domicile, statut } = req.body

  // Confirm data 
  if (!nom || !prenom || !sexe || !email || !telephone || !poste || !domicile || !statut) {
    return res.status(400).json({ message: 'Tous les champs sont requis' })
  }

  // Check for duplicate 

  const duplicate = await Personnel.findOne({ email }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'email deja utilise' })
  }

  // create and store personnel 

  const personnelObject = {
    nom,
    prenom,
    sexe,
    email,
    telephone,
    poste,
    domicile,
    statut
  };


  const personnel = await Personnel.create(personnelObject)

  if (personnel) { //created
    response.status(201).json({ message: `Nouveau personnel ${nom} creer` })
  } else {
    response.status(400).json({ message: ' information invalide recuperer ' })
  }

})

// @desc Update a personnel
// @route PACTH /personnel
// @access Private 

const updatePersonnel = asyncHandler(async (req, res) => {
  const { id, nom, prenom, email, sexe, telephone, poste, domicile, statut } = req.body

  // Confirm data 
  if (!id || !nom || !prenom || !email || !sexe || !telephone || !poste || !domicile || !statut) {
    return res.status(400).json({ message: ' Tous les champs sont requis' })
  }

  const personnel = await Personnel.findById(id).exec()

  if (!personnel) {
    return res.status(400).json({ message: 'Personnel non trouver' })
  }

  // check for duplicate 
  const duplicate = await Personnel.findOne({ telephone }).lean().exec()
  // Allow update to the original user 
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate telephone' })
  }

  personnel.nom = nom 
  personnel.prenom = prenom
  personnel.sexe = sexe
  personnel.email = email
  personnel.telephone = telephone
  personnel.poste = poste
  personnel.domicile = domicile
  personnel.statut  

  const updatePersonnel = await personnel.save()
  res.json({ message: `${updatePersonnel.nom} mise a jour`})

})

// @desc Delete a personnel
// @route DELETE /personnel
// @access Private 

const deletePersonnel = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'ID du personnel requis '})
  }

  // Ne pas effacer un personnel qui a un compte

  const user = await User.findOne({ user: id }).lean().exec()
  if (user) {
    return res.status(400).json({ message: 'Ce personnel a un compte '})
  }

  const personnel = await Personnel.findById(id).exec()

  if(!personnel) {
    return res.status(400).json({ message: ' personnel pas trouve '})
  }


  const result = await personnel.deleteOne()

  const reply = `Personnel ${result.nom} avec l'ID ${result._id} effacer `

  res.json(reply)

})



module.exports = {
  getAllPersonnel,
  createnewPersonnel,
  updatePersonnel,
  deletePersonnel
}