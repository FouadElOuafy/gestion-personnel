const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nom:         { type: String, required: true },
  prenom:      { type: String, default: '' },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['admin', 'manager', 'employe'], default: 'employe' },
  telephone:   { type: String, default: '' },
  adresse:     { type: String, default: '' },
  actif:       { type: Boolean, default: true },
  departement: { type: mongoose.Schema.Types.ObjectId, ref: 'Departement', default: null },
}, { timestamps: true })

// ← PAS de pre('save') ici
// Le hash se fait directement dans auth.js et users.js

module.exports = mongoose.model('User', userSchema)