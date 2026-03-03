# Rapport du Projet TodoList API REST

## 1. Présentation

### Sujet Choisi
Pour ce projet, j'ai décidé d'implémenter une API REST de gestion de tâches (`TodoList`). Ce sujet permet de mettre en pratique l'ensemble des concepts de base requis (CRUD) tout en étant facilement extensible avec de nouveaux champs utiles (titre, description et statut complété). 

### Stack Technique & Justifications
La pile technologique choisie est **Node.js avec Express**, interagissant avec une base de données **MongoDB** (via l'ORM **Mongoose**). Le projet utilise **Jest** et **Supertest** pour l'écriture des tests automatisés, et la pipeline d'intégration (CI) est assurée par **GitHub Actions**.

**Pourquoi ces choix ?**
- **Node.js & Express** : C'est une technologie asynchrone, très populaire pour la conception d'API REST légères et performantes. La communauté et la documentation sont excellentes.
- **MongoDB & Mongoose** : Ce système NoSQL est très flexible et s'intègre naturellement avec l'écosystème JavaScript/JSON (manipulation de documents JSON en natif).
- **Docker & Docker Compose** : Permet la standardisation de l'environnement de production en containerisant l'application Node et la base de données. Tous les développeurs ou serveurs disposant de Docker peuvent lancer l'application (et même l'interface gérant la BDD Mongo Express).
- **GitHub Actions** : Permet d'automatiser des flux de validation et de tests de manière transparente depuis le dépôt de code à chaque `push` ou *Pull Request*.

---

## 2. Architecture

### Schéma de l'API (Routes et Modèle de Données)

#### Modèle de données (Todo) :
- `_id` : L'identifiant unique (ObjectId de MongoDB)
- `title` : String, obligatoire (trim activé)
- `description` : String
- `completed` : Boolean, valeur par défaut `false`
- `createdAt` / `updatedAt` : Timestamp auto-générés

#### Routes Disponibles :
| Méthode  | Route                 | Description                        | Code retour |
| -------- | --------------------- | ---------------------------------- | ----------- |
| `GET`    | `/health`             | Surveille l'état de l'API          | *200*       |
| `GET`    | `/todos`              | Liste de toutes les tâches         | *200*       |
| `GET`    | `/todos/:id`          | Récupère une tâche  spécifique     | *200* ou *404* |
| `POST`   | `/todos`              | Création d'une nouvelle tâche      | *201* ou *400* |
| `PUT`    | `/todos/:id`          | Met à jour une tâche par son ID    | *200* ou *404* ou *400* |
| `DELETE` | `/todos/:id`          | Supprime une tâche                 | *200* ou *404* |

*(Note : les routes fonctionneront également via un alias `/ressources` afin de toujours correspondre aux attentes du sujet)*

### Schéma Docker (Services & Réseau)

L'architecture s'articule autour de 3 services déployés via Docker Compose sur un seul réseau appelé `app-network` (driver: bridge).

1. **`api`** : Le conteneur Node.js hébergeant le code de l'API (port public : `3000`). Ce conteneur "attend" la base de données avant de démarrer grâce à `depends_on`.
2. **`db`** : Conteneur basé sur l'image MongoDB v6 (port exposé `27017` par défaut). Il utilise un volume `mongo-data` pour la persistance des données.
3. **`mongo-express`** *(Bonus)* : Interface visuelle de base de données permettant de lire/modifier les collections facilement dans MongoDB sur le port `8081`.

---

## 3. Pipeline CI/CD

Le fichier `.github/workflows/ci.yml` décrit le pipeline **GitHub Actions** qui s'active à chaque *Push* sur la branche principale et à chaque *Pull Request*. Ce pipeline comporte 3 stages/jobs qui s'exécutent de de matière séquentielle pour garantir un code sûr.

┌──────────┐     ┌──────────┐     ┌──────────────┐
│   Lint   │ ──→ │  Tests   │ ──→ │ Docker Build │
└──────────┘     └──────────┘     └──────────────┘

1. **Lint** (`npm run lint`) : Utilise `ESLint` pour vérifier qu'aucune erreur de syntaxe ou mauvaise pratique JavaScript n'est enfouie dans le code avant de poursuivre.
2. **Tests** (`npm test`) : Ce run nécessite le lancement d'un service (une BDD MongoDB instanciée `on-the-fly` pour GitHub Actions). Une fois connecté à cette base, Jest passe la série de tests qui évaluent les cas nominaux et d'erreurs (champs non renseignés, identifiants faux).
3. **Docker Build** : Utilise `docker/setup-buildx-action` pour réaliser le build à des fins de tests virtuels. Si l'image Node.js refuse de compiler, l'action échoue, évitant un déploiement corrompu en production.

*(Placez votre Screenshot du pipeline vert GitHub Actions ci-dessous)*

[**SCREENSHOT PIPELINE GitHub Actions**]

---

## 4. Difficultés Rencontrées

1. **Intégration Asynchrone dans Jest**: Il est parfois délicat de réinitialiser la collection et de supprimer / créer des bases de tests entre chaque test (Hooks `beforeEach`, `beforeAll`, `afterAll`).
   *Solution* : Utilisation des fonctions `mongoose.connection.dropDatabase()` en fin de cycle, permettant aux tests d'être parfaitement isolés à chaque exécution, quel que soit l'ordre de passage.
2. **Connexions BDD et Docker**: Lors de l'envoi vers un conteneur via Docker Compose, le service `api` ne pouvait pas appeler `localhost:27017` puisque la BDD était sous un autre conteneur isolé.
   *Solution* : Modification de l'URI MONGODB locale test en variables d'environnement `process.env.MONGODB_URI` affectée `mongodb://db:27017` par le `docker-compose.yml`, pour s'adresser au container MongoDB qui porte le nom du service (`db`).
3. **Gestion des requêtes non valides JSON** :
   *Solution* : Utilisation du module complet Mongoose qui prend lui-même en charge les cas de cast error (`CastError` pour la BDD où l'ID n'est pas de format BSON) et les catch avec une erreur correspondante `404` ou `400`.

---

## 5. Fonctionnement Final & Bonus Exploités

Outre les exigences de base pour une note de 20/20, de nombreuses options recommandées ont pu être introduites :
- **Pagination & Limitations** via les requêtes `?page=1&limit=10`
- **Triage & Filtrage** : Le paramètre `?completed=true` ou `?sortBy=createdAt&order=asc` permet de réduire considérablement la recherche.
- **Démarrage par Initialisation (Seed)** : Un set de la TodoList commence directement par défaut lors du premier lancement de l'application !
- **Interface d'administration de la BDD** ajoutée sur Docker en se rendant sur le port 8081 !

*(Placez votre Screenshot d'une requête dans l'API ci-dessous (Postman, Insomnia, ou cURL))*

[**SCREENSHOT API FONCTIONELLE**]
