# TodoList API REST

Ce projet est une API REST complète gérant une Todo List, incluant le CRUD, la validation, une base de données MongoDB, et une containerisation avec Docker. 

## Prérequis
- Docker et Docker Compose
- Node.js (facultatif si exécuté via Docker uniquement)

## Lancement avec Docker (Recommandé)

Pour la lancer en local via Docker, exécutez la commande :

```sh
docker compose up --build -d
```

L'API sera disponible sur : `http://localhost:3000`
MongoDB sera exposé sur : `localhost:27017`
Mongo Express (Interface d'admin BDD) sur : `http://localhost:8081`

## Fonctionnalités

- **CRUD Complet** : Création, Lecture, Modification, Suppression
- **Validation** : Les requêtes sont filtrées, avec des erreurs de type 400 ou 404 retournées en cas de mauvaise demande.
- **Base de Données** : Persistance des données dans MongoDB avec seed initial.
- **Bonus** : Pagination, Filtrage (ex: `?completed=true`), Tri (ex: `?sortBy=createdAt&order=asc`), Seed de données, et interface d'admin Mongo Express incluse sur le port 8081.

## Routes API

- `GET /health` : Health check de l'API
- `GET /todos` : Listes les Todos avec pagination
- `GET /todos/:id` : Récupère une todo par son ID
- `POST /todos` : Crée une nouvelle Todo
- `PUT /todos/:id` : Met à jour une todo
- `DELETE /todos/:id` : Supprime une todo

## Tests

Pour exécuter les tests localement (Node et MongoDB requis en local) :
```sh
npm install
npm test
```
