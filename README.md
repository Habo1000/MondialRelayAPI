# MondialRelayAPI

> 🚀 Une API REST/JSON moderne qui encapsule l'API SOAP historique de Mondial Relay

## 📋 Objectif du Projet

Construire un service intermédiaire (*wrapper*) qui se place entre le client final et l'API officielle de Mondial Relay. Le client final n'appellera plus jamais l'API SOAP directement : il utilisera une **API REST moderne en JSON**.

En une phrase : **Créer une API REST/JSON propre et documentée qui encapsule l'API SOAP historique de Mondial Relay, en commençant par la recherche de Points Relais®.**

---

## ✨ Caractéristiques

- ✅ **Interface REST moderne** : JSON au lieu de SOAP XML
- ✅ **Wrapper intelligent** : Gère automatiquement les appels SOAP en arrière-plan
- ✅ **Recherche de Points Relais** : Point de départ du projet
- ✅ **Documentation API** : Endpoints clairs et bien documentés
- ✅ **Gestion d'erreurs** : Réponses d'erreur cohérentes et explicites
- ✅ **Extensible** : Architecture prête pour ajouter d'autres services Mondial Relay

---

## 🛠️ Stack Technique

- **Runtime** : Node.js / TypeScript
- **Framework** : Express.js (ou framework Node.js de votre choix)
- **Client SOAP** : `soap` ou `node-soap`
- **Documentation** : Swagger/OpenAPI
- **Gestion de config** : Variables d'environnement

---

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Comptes/identifiants Mondial Relay pour l'API SOAP

### Setup

```bash
# Cloner le repository
git clone https://github.com/Habo1000/MondialRelayAPI.git
cd MondialRelayAPI

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos identifiants Mondial Relay

# Lancer le serveur
npm start
