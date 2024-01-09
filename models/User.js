const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema(
  {
    personnel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Personnel'
    },
    matricule: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    roles: {
      type: String,
      enum:['Admin' , 'Employee', 'Lead'],
      default: "Employee",
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  }, 
  {
    timestamps:true
  }

)

userSchema.plugin(AutoIncrement, {
  inc_field: 'numero',
  id: 'numeroUser',
  start_seq: 1
})

module.exports = mongoose.model('User', userSchema)