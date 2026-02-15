# WorkFit - React + Vite + API Express

## Déploiement Docker / Dokploy

Le projet fournit maintenant une stack `docker-compose.yml` compatible VPS/Dokploy avec 3 services :

- `web` : front React/Vite buildé puis servi par Nginx (port `8080`)
- `api` : API Express (port `3001`)
- `db` : PostgreSQL 16 (port `5432`)

### Lancer localement avec Docker Compose

```bash
docker compose up -d --build
```

### Variables importantes (service `api`)

- `FRONTEND_URL` : URL du front autorisée par CORS
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### Dokploy (VPS)

1. Crée un nouveau projet `Compose` dans Dokploy.
2. Pousse ce repo sur ton Git provider.
3. Sélectionne ce dépôt + branche.
4. Dokploy détecte `docker-compose.yml` à la racine.
5. Configure les variables d'environnement (surtout DB et `FRONTEND_URL`).
6. Déploie.

> ⚠️ Pense à remplacer les mots de passe DB par des secrets robustes en production.
