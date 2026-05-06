const express  = require('express')
const router   = express.Router()
const Employe  = require('../models/Employe')
const User     = require('../models/User')
const { protect, adminOnly, adminOrManager } = require('../middleware/authMiddleware')

// GET — équipe du manager (DOIT être avant /:id)
router.get('/mon-equipe', protect, async (req, res) => {
  try {
    const manager = await User.findById(req.user.id)

    if (!manager.departement) return res.json([])

    const deptId = manager.departement.toString()

    // ✅ Cherche avec les deux formats : ObjectId ET String
    const employes = await Employe.find({
      $or: [
        { departement: manager.departement },
        { departement: deptId }
      ]
    })

    res.json(employes)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

// GET — tous les employés
router.get('/', protect, async (req, res) => {
  try {
    let employes
    if (req.user.role === 'admin') {
      employes = await Employe.find()
    } else if (req.user.role === 'manager') {
      const manager = await User.findById(req.user.id)
      if (!manager.departement) return res.json([])
      const deptId = manager.departement.toString()

      // ✅ Cherche avec les deux formats : ObjectId ET String
      employes = await Employe.find({
        $or: [
          { departement: manager.departement },
          { departement: deptId }
        ]
      })
    } else {
      employes = await Employe.find({ user: req.user.id })
    }
    res.json(employes)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

// POST — ajouter un employé
router.post('/', protect, adminOrManager, async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.user.role === 'manager') {
      const manager = await User.findById(req.user.id)
      data.departement = manager.departement
    }
    if (data.emailUser) {
      const user = await User.findOne({ email: data.emailUser })
      if (!user) return res.status(400).json({
        message: `Aucun compte trouvé avec l'email : ${data.emailUser}`
      })
      data.user = user._id
      delete data.emailUser
    }
    const employe = new Employe(data)
    await employe.save()
    res.status(201).json(employe)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// PUT — modifier un employé
router.put('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.user.role === 'manager') {
      const manager  = await User.findById(req.user.id)
      const employe  = await Employe.findById(req.params.id)
      if (employe.departement?.toString() !== manager.departement?.toString()) {
        return res.status(403).json({
          message: "Cet employé n'est pas dans votre département"
        })
      }
    }
    if (data.emailUser) {
      const user = await User.findOne({ email: data.emailUser })
      if (!user) return res.status(400).json({
        message: `Aucun compte trouvé avec l'email : ${data.emailUser}`
      })
      data.user = user._id
      delete data.emailUser
    }
    const employe = await Employe.findByIdAndUpdate(
      req.params.id, data, { new: true }
    )
    res.json(employe)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// DELETE — supprimer (admin seulement)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Employe.findByIdAndDelete(req.params.id)
    res.json({ message: 'Employé supprimé' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router