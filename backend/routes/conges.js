const express  = require('express')
const router   = express.Router()
const Conge    = require('../models/Conge')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', protect, async (req, res) => {
  try {
    const User    = require('../models/User')
    const Employe = require('../models/Employe')
    let conges

    if (req.user.role === 'admin') {
      conges = await Conge.find()
        .populate('employe', 'nom prenom poste')

    } else if (req.user.role === 'manager') {
      const manager = await User.findById(req.user.id)
      if (!manager.departement) return res.json([])
      const employesDuDept = await Employe.find({
        departement: manager.departement.toString()
      })
      const ids = employesDuDept.map(e => e._id)
      conges = await Conge.find({ employe: { $in: ids } })
        .populate('employe', 'nom prenom poste')

    } else {
      const employe = await Employe.findOne({ user: req.user.id })
      if (!employe) return res.json([])
      conges = await Conge.find({ employe: employe._id })
        .populate('employe', 'nom prenom poste')
    }

    res.json(conges)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})
// POST — demander un congé
router.post('/', protect, async (req, res) => {
  try {
    const conge = new Conge(req.body)
    await conge.save()
    res.status(201).json(conge)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// PUT — approuver ou refuser (admin/manager)
router.put('/:id/statut', protect, async (req, res) => {
  try {
    const conge = await Conge.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut, commentaire: req.body.commentaire },
      { new: true }
    )
    res.json(conge)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})
// GET — mes congés seulement (employé)
router.get('/mes-conges', protect, async (req, res) => {
  try {
    // req.user.id = l'id de l'utilisateur connecté
    // On cherche l'employé lié à cet utilisateur
    const Employe = require('../models/Employe')
    const employe = await Employe.findOne({ user: req.user.id })

    if (!employe) return res.json([]) // pas encore de fiche employé

    const conges = await Conge.find({ employe: employe._id })
      .populate('employe', 'nom prenom poste')
      .sort({ createdAt: -1 })

    res.json(conges)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})
// GET — congés du département du manager
router.get('/mon-departement', protect, async (req, res) => {
  try {
    const User    = require('../models/User')
    const Employe = require('../models/Employe')

    const user     = await User.findById(req.user.id)
    const employes = await Employe.find({ departement: user.departement })
    const ids      = employes.map(e => e._id)

    const conges = await Conge.find({ employe: { $in: ids } })
      .populate('employe', 'nom prenom poste')
      .sort({ createdAt: -1 })

    res.json(conges)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router