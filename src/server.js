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
                { title: "Mettre en place l'API", completed: true },
                { title: "Ajouter MongoDB", description: "Utiliser mongoose", completed: true },
                { title: "Devenir un expert DevOps", completed: false }
            ]);
            console.log("✅ Données de seed ajoutées");
        }
    } catch (err) {
        console.error("❌ Erreur de seed:", err.message);
    }
}

connectDB().then(() => {
    seedDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        });
    });
}).catch(err => {
    console.log("Erreur de db:", err);
});
