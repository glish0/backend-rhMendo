const express = require('express')
const router = express.Router()
const personnelController = require('../controller/personnelController')

router.route('/')
  .get(personnelController.getAllPersonnel)
  .post(personnelController.createnewPersonnel) 
  .patch(personnelController.updatePersonnel) 
  .delete(personnelController.deletePersonnel) 


  module.exports = router 