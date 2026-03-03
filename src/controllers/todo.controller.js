const Todo = require('../models/todo.model');

exports.createTodo = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Le titre est obligatoire' });
        }

        const newTodo = new Todo({ title, description, completed });
        const savedTodo = await newTodo.save();

        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.completed !== undefined) {
            query.completed = req.query.completed === 'true';
        }

        let sort = { createdAt: -1 };
        if (req.query.sortBy) {
            const order = req.query.order === 'asc' ? 1 : -1;
            sort = { [req.query.sortBy]: order };
        }

        const todos = await Todo.find(query).sort(sort).skip(skip).limit(limit);
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo introuvable' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(404).json({ message: 'Todo introuvable ou ID invalide' });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({ message: 'Le titre ne peut pas être vide' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo introuvable' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo introuvable' });
        }
        res.status(200).json({ message: 'Todo supprimé avec succès' });
    } catch (error) {
        res.status(404).json({ message: 'Todo introuvable ou ID invalide' });
    }
};
// Feature controllers ready
