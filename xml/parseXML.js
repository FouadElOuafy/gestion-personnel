const fs       = require('fs')
const xml2js   = require('xml2js')
const mongoose = require('mongoose')
require('dotenv').config({ path: '../backend/.env' })

// Modèle Employe simplifié pour l'import
const employeSchema = new mongoose.Schema({
  nom: String, prenom: String, email: String,
  poste: String, departement: String,
  salaire: Number, statut: String
})
const Employe = mongoose.model('Employe', employeSchema)

const parser = new xml2js.Parser({ explicitArray: false })

async function main() {
  // 1. Lire le fichier XML
  const xml = fs.readFileSync('./employes.xml', 'utf8')
  console.log('✅ XML lu')

  // 2. Parser XML → JSON
  const result = await parser.parseStringPromise(xml)
  const employes = result.etudiants.employe

  console.log(`✅ ${employes.length} employé(s) trouvé(s) dans le XML`)

  // 3. Sauvegarder en JSON pour vérification
  fs.writeFileSync('./employes.json',
    JSON.stringify(employes, null, 2), 'utf8')
  console.log('✅ employes.json généré')

  // 4. Connexion MongoDB et import
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB connecté')

  for (const emp of employes) {
    const existe = await Employe.findOne({ email: emp.email })
    if (!existe) {
      await Employe.create({
        nom:         emp.nom,
        prenom:      emp.prenom,
        email:       emp.email,
        poste:       emp.poste,
        departement: emp.departement,
        salaire:     Number(emp.salaire),
        statut:      emp.statut
      })
      console.log(`  → Importé : ${emp.nom} ${emp.prenom}`)
    } else {
      console.log(`  → Ignoré (déjà existe) : ${emp.email}`)
    }
  }

  console.log('✅ Import terminé')
  mongoose.disconnect()
}

main().catch(console.error)