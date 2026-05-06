const express = require('express')
const router  = express.Router()
const User    = require('../models/User')
const bcrypt  = require('bcryptjs')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET — tous les utilisateurs
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

// GET — mon profil
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

// PUT — modifier mon profil
router.put('/me', protect, async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, telephone, adresse },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// PUT — changer mot de passe
router.put('/me/password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const ok = await bcrypt.compare(req.body.ancienPassword, user.password)
    if (!ok) return res.status(400).json({ message: 'Ancien mot de passe incorrect' })
    /*user.password = req.body.nouveauPassword
    await user.save()*/
     // ← hasher manuellement avant save
    user.password = await bcrypt.hash(req.body.nouveauPassword, 10)
    await user.save()
    res.json({ message: 'Mot de passe modifié' })
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// POST — créer un utilisateur
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const u = user.toObject(); delete u.password
    res.status(201).json(u)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// PUT — modifier un utilisateur
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).select('-password')
    res.json(user)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// DELETE
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Supprimé' })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

module.exports = router