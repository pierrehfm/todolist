const mongoose = require('mongoose');

const connectDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist_test';
            await mongoose.connect(mongoURI);
            console.log('MongoDB connecté avec succès');
            break;
        } catch (err) {
            console.error('Erreur de connexion MongoDB:', err.message);
            retries -= 1;
            console.log(`Tentatives restantes : ${retries}. Réessai dans 5 secondes...`);
            if (retries === 0) {
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

module.exports = connectDB;
