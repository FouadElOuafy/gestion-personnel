const mongoose = require('mongoose')

const employeSchema = new mongoose.Schema({
  nom:          { type: String, required: true },
  prenom:       { type: String, default: '' },
  email:        { type: String, required: true, unique: true },
  poste:        { type: String, required: true },
  departement:  { type: mongoose.Schema.Types.ObjectId, ref: 'Departement', default: null }, // ← CORRIGÉ
  salaire:      { type: Number, default: 0 },
  telephone:    { type: String, default: '' },
  dateEmbauche: { type: Date, default: Date.now },
  statut:       { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true })

module.exports = mongoose.model('Employe', employeSchema)

// const mongoose = require('mongoose')

// const employeSchema = new mongoose.Schema({
//   nom:          { type: String, required: true },
//   prenom:       { type: String, default: '' },
//   email:        { type: String, required: true, unique: true },
//   poste:        { type: String, required: true },
//   departement:  { type: String, default: '' },
//   salaire:      { type: Number, default: 0 },
//   telephone:    { type: String, default: '' },
//   dateEmbauche: { type: Date, default: Date.now },
//   statut:       { type: String, enum: ['actif', 'inactif'], default: 'actif' },
//   user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
// }, { timestamps: true })

// module.exports = mongoose.model('Employe', employeSchema)