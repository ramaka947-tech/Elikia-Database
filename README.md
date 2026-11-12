# Elikia Database (MVP)

Plateforme de recherche et de consultation des entreprises et entrepreneurs du Sénégal.
Parcours principal : **chercher, filtrer, consulter une fiche, administrer la donnée**.

Livraison : **lundi**.

---

## Équipe et répartition

Chaque membre développe **sa fonctionnalité de bout en bout** : la route API (backend) et la page (frontend). Comme ça personne ne travaille dans les mêmes fichiers.

| Membre | Fonctionnalité | Backend | Frontend |
|---|---|---|---|
| **Rama KA** (lead du dépôt) | Socle technique | Setup Express, connexion PostgreSQL, auth (login, JWT, bcrypt), middlewares de rôles, script de création admin, déploiement | Setup React, routing, layout (header, menu, couleurs), composants UI partagés, page Connexion, gestion du token |
| **Assane Ndongue** | Répertoire | Recherche globale, filtres combinables, pagination, export CSV | Page Répertoire : barre de recherche, filtres, liste des résultats, pagination, bouton export |
| **Abdoulaye BA** | Fiche + administration | Détail d'une entreprise, création, modification, archivage/suppression, liste des secteurs | Page Fiche, formulaire création/modification, boutons archiver/supprimer |
| **Sophiatou Ndiaye** | Données, import, dashboard | Import CSV (validation, doublons, erreurs ligne par ligne), statistiques du dashboard | Page Import, page Dashboard, jeu de données de démo, modèle CSV, recette finale |

**Règle :** chacun ne modifie que ses propres fichiers. Les fichiers partagés (voir plus bas) sont gérés par Rama. Si tu as besoin d'y toucher, préviens le groupe avant.

---

## Technologies

| Partie | Outils |
|---|---|
| Frontend | React + Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Base de données | PostgreSQL (driver `pg`, requêtes SQL) |
| Authentification | JWT (`jsonwebtoken`) + mots de passe hachés (`bcryptjs`) |
| Upload / CSV | `multer` (upload), `papaparse` (lecture et écriture CSV) |
| Hébergement | Render (API + PostgreSQL), Vercel (frontend) |
| Versionnement | Git + GitHub |

Hors périmètre du MVP : scraping, IA, paiement, API publique, application mobile native.

---

## Style : Tailwind CSS

Tailwind est **déjà installé et configuré**. On utilise **Tailwind v4** : il n'y a **pas** de fichier `tailwind.config.js` (les tutos qui en parlent sont pour l'ancienne version v3, ne pas en créer).

- Le style s'écrit **directement dans le JSX** avec `className`. Pas de fichiers `.css` par composant.
- Les couleurs Elikia sont définies une seule fois dans `frontend/src/index.css` (fichier partagé, géré par Rama) :

| Classe | Couleur | Usage |
|---|---|---|
| `bg-elikia`, `text-elikia`, `border-elikia` | vert Elikia | boutons principaux, titres, header |
| `bg-elikia-dark` | vert foncé | survol des boutons |
| `bg-elikia-light` | vert très clair | fonds de section, badges "vérifié" |
| `text-gold`, `border-gold` | doré | petites touches d'accent uniquement |
| `text-ink` | gris foncé | texte principal |

- Avant de créer un bouton, un champ ou un badge, **utiliser les composants de `components/ui/`** (`Button`, `Input`, `Badge`) pour que toute l'application ait le même style.
- Penser mobile : utiliser les préfixes `md:` et `lg:` (ex : `grid grid-cols-1 md:grid-cols-3`).

Exemple :

```jsx
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

<div className="bg-white rounded-xl shadow p-4">
  <h2 className="text-lg font-semibold text-elikia">Sonatel</h2>
  <Badge color="green">Vérifié</Badge>
  <Button>Voir la fiche</Button>
</div>
```

Besoin d'une nouvelle couleur ou d'un nouveau composant partagé : demander à Rama.

---

## Organisation du code

```
backend/
  src/
    server.js                       Rama (partagé)
    db.js                           Rama (partagé)
    middlewares/auth.js             Rama (partagé)
    routes/auth.routes.js           Rama
    routes/search.routes.js         Assane
    routes/companies.routes.js      Abdoulaye
    routes/sectors.routes.js        Abdoulaye
    routes/import.routes.js         Sophiatou
    routes/stats.routes.js          Sophiatou
  sql/schema.sql                    Rama (partagé)
  sql/seed_sectors.sql              Sophiatou
  scripts/create-admin.js           Rama
  .env.example

frontend/
  src/
    main.jsx, App.jsx               Rama (partagé : routes)
    api/client.js                   Rama (partagé : Axios + token)
    context/AuthContext.jsx         Rama (partagé)
    components/layout/              Rama (partagé)
    components/ui/                  Rama (partagé : boutons, inputs, badges)
    pages/Login.jsx                 Rama
    pages/Repertoire.jsx            Assane
    components/repertoire/          Assane
    pages/Fiche.jsx                 Abdoulaye
    pages/CompanyForm.jsx           Abdoulaye
    components/fiche/               Abdoulaye
    pages/Dashboard.jsx             Sophiatou
    pages/Import.jsx                Sophiatou
    components/import/              Sophiatou
    components/dashboard/           Sophiatou
  .env.example
```

**Fichiers partagés (ne pas modifier sans prévenir) :** `server.js`, `db.js`, `middlewares/`, `sql/schema.sql`, `App.jsx`, `api/client.js`, `context/`, `components/layout/`, `components/ui/`, et les deux `package.json`.

Toutes les routes sont déjà branchées dans `server.js` et toutes les pages dans `App.jsx` dès le départ. Chacun n'a qu'à remplir son fichier.

Si tu dois ajouter une dépendance npm, préviens le groupe : deux personnes qui modifient `package.json` en même temps créent des conflits.

---

## Contrat de l'API

Tout le monde se base sur ce tableau. Si tu changes une route ou le format d'une réponse, préviens le groupe.

| Méthode | Route | Accès | Responsable | Rôle |
|---|---|---|---|---|
| POST | `/api/auth/login` | public | Rama | Connexion, renvoie `{ token, user }` |
| GET | `/api/auth/me` | connecté | Rama | Utilisateur courant |
| GET | `/api/companies?q=&sector=&region=&city=&legal_form=&size=&status=&has_website=&has_email=&has_phone=&min_confidence=&page=&limit=` | connecté | Assane | Recherche + filtres + pagination, renvoie `{ data, total, page, limit }` |
| GET | `/api/companies/export?...mêmes filtres` | connecté | Assane | Export CSV des résultats filtrés |
| GET | `/api/companies/:id` | connecté | Abdoulaye | Fiche complète (avec dirigeants et secteur) |
| POST | `/api/companies` | ADMIN | Abdoulaye | Créer une entreprise |
| PUT | `/api/companies/:id` | ADMIN | Abdoulaye | Modifier une entreprise |
| PATCH | `/api/companies/:id/archive` | ADMIN | Abdoulaye | Archiver |
| DELETE | `/api/companies/:id` | ADMIN | Abdoulaye | Supprimer |
| GET | `/api/sectors` | connecté | Abdoulaye | Liste des secteurs et sous-secteurs |
| POST | `/api/import` | ADMIN | Sophiatou | Import CSV, renvoie `{ imported, duplicates, errors: [{ line, message }] }` |
| GET | `/api/stats` | connecté | Sophiatou | KPI : total, top 5 secteurs, top 5 villes, fiches mises à jour sur 30 jours |

Le token JWT est envoyé dans l'en-tête : `Authorization: Bearer <token>`.

---

## Branches Git

```
main        version stable, déployée. Personne ne pousse dessus directement.
develop     branche d'intégration. Toutes les pull requests arrivent ici.
feat/...    une branche par personne, créée depuis develop.
```

Branches de travail :

- `feat/socle` (Rama)
- `feat/repertoire` (Assane)
- `feat/fiche-admin` (Abdoulaye)
- `feat/import-dashboard` (Sophiatou)

### Workflow quotidien

```bash
# 1. Se mettre à jour avant de commencer
git checkout develop
git pull origin develop

# 2. Aller sur sa branche et récupérer les nouveautés de develop
git checkout feat/ma-branche
git merge develop

# 3. Travailler, puis committer souvent avec des messages clairs
git add .
git commit -m "feat(repertoire): ajout du filtre par région"

# 4. Pousser sa branche
git push origin feat/ma-branche
```

5. Sur GitHub, ouvrir une **Pull Request de `feat/ma-branche` vers `develop`** (jamais vers `main`).
6. Une autre personne relit et valide, puis on merge.
7. Rama merge `develop` vers `main` quand une version est stable et testée.

---

## Installation (pour chaque membre)

Prérequis : Node.js 20+, PostgreSQL installé en local (ou accès à la base partagée).

```bash
git clone <URL_DU_DEPOT>
cd elikia-database
git checkout develop
git checkout -b feat/ma-branche
```

### Base de données

```bash
createdb elikia
psql -d elikia -f backend/sql/schema.sql
psql -d elikia -f backend/sql/seed_sectors.sql
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run create-admin     # crée le compte ADMIN de test
npm run dev              # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

---

## Variables d'environnement

**backend/.env**

| Variable | Exemple |
|---|---|
| `PORT` | `5000` |
| `DATABASE_URL` | `postgresql://postgres:motdepasse@localhost:5432/elikia` |
| `JWT_SECRET` | une longue chaîne aléatoire |
| `JWT_EXPIRES_IN` | `1d` |
| `CLIENT_URL` | `http://localhost:5173` |

**frontend/.env**

| Variable | Exemple |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |

Les fichiers `.env` ne doivent **jamais** être commités. Seuls les `.env.example` (sans vraies valeurs) sont dans le dépôt.

---

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| ADMIN | admin@elikia.sn | Admin123! (créé par `npm run create-admin`) |
| USER | à compléter | à compléter |

---

## Import CSV

Colonnes attendues (voir `backend/sql/modele_import.csv`) :

```
name, legal_name, ninea, rccm, legal_form, sector, sub_sector, description,
city, region, address, employee_range, revenue_range, business_type,
primary_contact_name, primary_contact_role, phone, email, website,
linkedin_url, status, source, verified_at, confidence_score
```

Procédure : se connecter en ADMIN, aller sur **Import CSV**, choisir le fichier, vérifier le rapport (lignes importées, doublons, erreurs).

---

## Planning

| Jour | Objectif |
|---|---|
| Jeudi soir | Socle en place sur `develop`, chacun crée sa branche |
| Vendredi | Chacun développe sa fonctionnalité (backend + frontend) |
| Samedi | Intégration sur `develop`, import des vraies données |
| Dimanche | Responsive mobile, corrections, déploiement, vidéo de démo, P1 si temps |
| Lundi | Démo |

**Priorité :** si on est en retard, on abandonne les fonctions P1 (listes/favoris, profil, journal) avant de bâcler les fonctions P0.

---

## Definition of Done

Un utilisateur peut se connecter, rechercher une entreprise, appliquer des filtres, ouvrir une fiche lisible. Un administrateur peut créer ou modifier une fiche, importer un CSV et exporter les résultats. L'application est déployée, responsive et stable.

---

## Bugs connus / améliorations

À compléter avant la livraison.
