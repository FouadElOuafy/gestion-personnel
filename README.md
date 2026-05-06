# 👥 Application de Gestion du Personnel

> Projet Full Stack — React · Node.js · MongoDB

![Stack](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=flat&logo=node.js)
![Stack](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb)
![Stack](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)

---

## 📋 Description

Application web full stack de gestion des ressources humaines (RH) permettant de gérer les employés, les départements et les congés au sein d'une entreprise. Le système intègre une authentification sécurisée JWT avec un contrôle d'accès basé sur 3 rôles distincts.

---

## 🏗️ Architecture 3 Couches

```
┌─────────────────────────────────────────┐
│         FRONTEND (Port 5173)            │
│         React 18 + Bootstrap 5          │
└──────────────────┬──────────────────────┘
                   │ HTTP / REST API
┌──────────────────▼──────────────────────┐
│         BACKEND (Port 3000)             │
│         Node.js + Express.js            │
│         JWT Middleware                  │
└──────────────────┬──────────────────────┘
                   │ Mongoose ODM
┌──────────────────▼──────────────────────┐
│         DATABASE                        │
│         MongoDB + Mongoose              │
└─────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
gestion-personnel/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Employe.js
│   │   ├── Departement.js
│   │   └── Conge.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employes.js
│   │   ├── departements.js
│   │   └── conges.js
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── server.js
│   ├── .env                 # ⚠️ Ne pas commiter !
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── admin/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🔧 Technologies Utilisées

### Backend
| Technologie | Rôle |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js | Framework Backend |
| MongoDB | Base de données NoSQL |
| Mongoose | ODM (Object Data Modeling) |
| JWT | Authentification par token |
| bcrypt | Hashage des mots de passe |

### Frontend
| Technologie | Rôle |
|---|---|
| React 18 | Framework UI |
| Bootstrap 5 | CSS Framework |
| Vite | Outil de build |
| Axios | Requêtes HTTP |

---

## 🗄️ Modèles de Données

### User
```js
{ nom, email, password (hashed), role: ['admin','manager','employe'] }
```

### Employe
```js
{ nom, prenom, poste, salaire, departement }
```

### Departement
```js
{ nom, description, manager }
```

### Conge
```js
{ employe, dateDebut, dateFin, statut: ['en attente','approuvé','refusé'] }
```

---

## 🔐 Authentification JWT

```
Login
  └─► bcrypt.compare(password)
        └─► jwt.sign(payload, secret)
              └─► Token envoyé au Frontend
                    └─► Stocké dans localStorage
                          └─► Authorization: Bearer <token>
                                └─► jwt.verify() → Accès autorisé
```

---

## 👥 Système de Rôles

| Rôle | Accès |
|---|---|
| 🔴 **ADMIN** | Accès complet — gère tous les employés, départements, utilisateurs |
| 🟠 **MANAGER** | Son département uniquement — approuve les congés, modifie son équipe |
| 🟢 **EMPLOYÉ** | Son profil uniquement — demande des congés, consulte ses données |

---

## 🌐 API REST — Routes Disponibles

| Méthode | URL | Rôle requis | Action |
|---|---|---|---|
| 🟢 GET | `/api/employes` | Admin / Manager | Lister les employés |
| 🔵 POST | `/api/employes` | Admin | Créer un employé |
| 🟠 PUT | `/api/employes/:id` | Admin / Manager | Modifier un employé |
| 🔴 DELETE | `/api/employes/:id` | Admin | Supprimer un employé |
| 🟢 GET | `/api/departements` | All | Lister les départements |
| 🔵 POST | `/api/departements` | Admin | Créer un département |
| 🟢 GET | `/api/conges` | Admin / Manager | Lister les congés |
| 🔵 POST | `/api/conges` | Employé | Demander un congé |
| 🟠 PUT | `/api/conges/:id` | Manager | Approuver / Refuser |
| 🔵 POST | `/api/auth/login` | Public | Connexion |
| 🔵 POST | `/api/auth/register` | Admin | Créer un utilisateur |

---

## ✅ Fonctionnalités Clés

- ✅ Authentification JWT sécurisée
- ✅ Gestion des employés (CRUD complet)
- ✅ Gestion des départements
- ✅ Système de congés avec validation
- ✅ Dashboard dynamique par rôle
- ✅ Filtrage des données par département
- ✅ Hashage des mots de passe avec bcrypt
- ✅ Interface responsive Bootstrap 5

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js >= 18
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/FouadElOuafy/gestion-personnel.git
cd gestion-personnel
```

### 2. Backend
```bash
cd backend
npm install
```

Crée un fichier `.env` dans `backend/` :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/gestion_personnel
JWT_SECRET=ton_secret_jwt_ici
```

```bash
node server.js
```
> API disponible sur http://localhost:3000

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
> Application disponible sur http://localhost:5173

---

## 👨‍💻 Auteur

**Fouad El-Ouafy**
🔗 [GitHub](https://github.com/FouadElOuafy)

---

## 📄 Licence

Ce projet est open source — [MIT License](LICENSE)
