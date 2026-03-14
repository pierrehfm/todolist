require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const Todo = require('./models/todo.model');

const seedDatabase = async () => {
    try {
        const count = await Todo.countDocuments();
        if (count === 0) {
            await Todo.create([
                { title: "Mettre en place l'API", description: "Structure de base Express", completed: true },
                { title: "Ajouter MongoDB", description: "Utiliser Mongoose pour les schémas", completed: true },
                { title: "Pagination et Filtrage", description: "Implémenter query params page et limit", completed: true },
                { title: "Tests unitaires", description: "Couvrir les routes CRUD", completed: true },
                { title: "Containerisation Docker", description: "Créer un Dockerfile et compose", completed: false }
            ]);
            console.log("Données de seed ajoutées (5 entrées)");
        }
    } catch (err) {
        console.error("Erreur de seed:", err.message);
    }
}

connectDB().then(() => {
    seedDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    });
}).catch(err => {
    console.log("Erreur de db:", err);
});
