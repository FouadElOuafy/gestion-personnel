const express       = require('express')
const router        = express.Router()
const Departement   = require('../models/Departement')
const Employe       = require('../models/Employe')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET — tous les départements
router.get('/', protect, async (req, res) => {
  try {
    const departements = await Departement.find().populate('manager', 'nom email')
    res.json(departements)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

// GET — stats d'un département
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const nbEmployes = await Employe.countDocuments({ departement: req.params.id })
    const employes   = await Employe.find({ departement: req.params.id })
    const totalSalaires = employes.reduce((sum, e) => sum + (e.salaire || 0), 0)
    res.json({ nbEmployes, totalSalaires })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

// POST — créer un département (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const dept = new Departement(req.body)
    await dept.save()
    res.status(201).json(dept)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// PUT — modifier (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const dept = await Departement.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    res.json(dept)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// DELETE — supprimer (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Departement.findByIdAndDelete(req.params.id)
    res.json({ message: 'Département supprimé' })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

module.exports = router