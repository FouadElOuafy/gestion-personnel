require('dotenv').config({ path: process.env.DOTENV_PATH || '.env' })
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')

const app = express()
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use('/api/auth',         require('./routes/auth'))
app.use('/api/employes',     require('./routes/employes'))
app.use('/api/departements', require('./routes/departements'))
app.use('/api/conges',       require('./routes/conges'))
app.use('/api/users',        require('./routes/users'))

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`)
  next()
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté')
    app.listen(process.env.PORT, () =>
      console.log(`✅ Serveur sur http://localhost:${process.env.PORT}`)
    )
  })
  .catch(err => console.error('❌', err))