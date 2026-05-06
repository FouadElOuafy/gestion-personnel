const mongoose = require('mongoose')

const departementSchema = new mongoose.Schema({
  nom:         { type: String, required: true, unique: true },
  description: { type: String },
  manager:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

module.exports = mongoose.model('Departement', departementSchema)