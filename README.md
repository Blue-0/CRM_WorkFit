# 🚀 WorkFit — La gestion client simplifiée

> **Le CRM moderne conçu pour les équipes qui avancent vite.**

[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](docker-compose.yml)
[![React](https://img.shields.io/badge/frontend-React_18-61DAFB.svg)](https://react.dev)
[![Express](https://img.shields.io/badge/api-Express_4.18-404040.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)

---

## ✨ Pourquoi WorkFit ?

| 🐌 Avant | 🚀 Avec WorkFit |
|---------|-----------------|
| Des outils CRM complexes et lourds | Une interface légère et intuitive |
| Des déploiements chronophages | Une stack Docker clé en main, déployée en minutes |
| Des intégrations coûteuses | Une API REST propre et documentée |

WorkFit regroupe tout ce dont vous avez besoin pour piloter votre relation client — sans la surcharge inutile.

---

## 🎯 Fonctionnalités clés

| Fonctionnalité | Ce que ça change pour vous |
|---------------|---------------------------|
| **📊 Dashboard temps réel** | Visualisez vos KPIs clients d'un coup d'œil |
| **👥 Gestion de contacts** | Centralisez toutes vos fiches clients |
| **🔗 API REST complète** | Intégrez WorkFit à votre écosystème en quelques lignes de code |
| **🎨 Interface responsive** | Travaillez de bureau, mobile ou tablette |
| **🔒 Authentification sécurisée** | Vos données restent entre de bonnes mains |

---

## 🏗️ Architecture moderne

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React 18    │────▶│   Express API │────▶│   PostgreSQL │
│   (Vite)      │     │   (Node.js)   │     │   (v16)       │
│   Port 8080   │     │   Port 3001   │     │   Port 5432   │
└─────────────┘     └─────────────┘     └─────────────┘
           Front moderne ↑        API rapide ↑         Base solide ↑
```

**Stack technique :** React 18 · Vite · Express.js · PostgreSQL 16 · Docker · Nginx

---

## 🚀 Déploiement rapide

### Local ( développement )

```bash
# Clone

git clone https://github.com/Blue-0/CRM_WorkFit.git
cd CRM_WorkFit

# Lance toute la stack en une commande
docker compose up -d --build
```

### Production (Dokploy / VPS)

| Étape | Action |
|-------|--------|
| 1 | Créez un projet **Compose** dans Dokploy |
| 2 | Connectez votre repo Git |
| 3 | Configurez vos variables d'environnement |
| 4 | Déployez en un clic |

> ⚠️ **Conseil pro** : Utilisez des secrets robustes pour la base de données en production.

---

## 🔧 Configuration

Variables d'environnement essentielles :

```bash
# API
FRONTEND_URL=https://monapp.com
DB_HOST=db
DB_PORT=5432
DB_NAME=workfit
DB_USER=postgres
DB_PASSWORD=votre_secret
```

---

## 🚦 Prêt à démarrer ?

```bash
# En 5 minutes chrono
git clone https://github.com/Blue-0/CRM_WorkFit.git
cd CRM_WorkFit
docker compose up -d --build
# → http://localhost:8080
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Forkez le projet, proposez vos idées, ouvrez une issue — tout le monde a sa place.

---

<div align="center">

**[⭐ Star ce repo](https://github.com/Blue-0/CRM_WorkFit)** · **[🐛 Signaler un bug](../../issues)** · **[💡 Proposer une fonctionnalité](../../issues)**

*Conçu avec ❤️ par l'équipe WorkFit*

</div>
