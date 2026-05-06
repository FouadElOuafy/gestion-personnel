const mongoose = require('mongoose')

const congeSchema = new mongoose.Schema({
  employe:    { type: mongoose.Schema.Types.ObjectId, ref: 'Employe', required: true },
  dateDebut:  { type: Date, required: true },
  dateFin:    { type: Date, required: true },
  motif:      { type: String, required: true },
  statut:     { type: String, enum: ['en_attente', 'approuve', 'refuse'], default: 'en_attente' },
  commentaire:{ type: String }
}, { timestamps: true })

module.exports = mongoose.model('Conge', congeSchema)