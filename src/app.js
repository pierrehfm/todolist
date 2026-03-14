const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.use('/todos', todoRoutes);

module.exports = app;
