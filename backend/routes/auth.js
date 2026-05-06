const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const User     = require('../models/User')
const Employe  = require('../models/Employe')

router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body

    const existe = await User.findOne({ email })
    if (existe) return res.status(400).json({ message: 'Email déjà utilisé' })

    // ✅ Hash le password AVANT de sauvegarder
    const hash = await bcrypt.hash(password, 10)

    const user = new User({ nom, prenom, email, password: hash, role })
    await user.save()

    if (role === 'employe') {
      const ficheEmploye = new Employe({
        nom, prenom: prenom || '', email,
        poste: 'Non défini', salaire: 0,
        statut: 'actif', user: user._id
      })
      await ficheEmploye.save()
    }

    res.status(201).json({ message: 'Compte créé avec succès' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Email introuvable' })

    // ✅ Compare password clair avec hash
    const valide = await bcrypt.compare(password, user.password)
    if (!valide) return res.status(400).json({ message: 'Mot de passe incorrect' })

    const token = jwt.sign(
      { id: user._id, role: user.role, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, role: user.role, nom: user.nom })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router



// const express    = require('express')
// const router     = express.Router()
// const bcrypt     = require('bcryptjs')
// const jwt        = require('jsonwebtoken')
// const User       = require('../models/User')

// // ─── REGISTER ───────────────────────────────────────
// router.post('/register', async (req, res) => {
//   try {
//     const { nom, email, password, role } = req.body

//     // 1. Vérifier si l'email existe déjà
//     const existe = await User.findOne({ email })
//     if (existe) return res.status(400).json({ message: 'Email déjà utilisé' })

//     // 2. Chiffrer le mot de passe
//     const hash = await bcrypt.hash(password, 10)

//     // 3. Créer l'utilisateur
//     const user = new User({ nom, email, password: hash, role })
//     await user.save()

//     res.status(201).json({ message: 'Compte créé avec succès' })

//   } catch (e) {
//     res.status(500).json({ message: e.message })
//   }
// })

// // ─── LOGIN ──────────────────────────────────────────
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body

//     // 1. Chercher l'utilisateur
//     const user = await User.findOne({ email })
//     if (!user) return res.status(400).json({ message: 'Email introuvable' })

//     // 2. Comparer le mot de passe
//     const valide = await bcrypt.compare(password, user.password)
//     if (!valide) return res.status(400).json({ message: 'Mot de passe incorrect' })

//     // 3. Créer le token JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role, nom: user.nom },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     )

//     res.json({ token, role: user.role, nom: user.nom })

//   } catch (e) {
//     res.status(500).json({ message: e.message })
//   }
// })

// module.exports = router