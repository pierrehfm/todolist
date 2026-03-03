const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Todo = require('../src/models/todo.model');

require('dotenv').config();

describe('Todo API', () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/todolist_jest_test';
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Todo.deleteMany({});
    });

    describe('GET /health', () => {
        it('devrait retourner le status 200', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('OK');
        });
    });

    describe('POST /todos', () => {
        it('devrait créer une nouvelle todo avec des données valides', async () => {
            const res = await request(app)
                .post('/todos')
                .send({ title: 'Test Todo', description: 'Test Description' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toBe('Test Todo');
        });

        it('devrait retourner 400 si le titre est manquant', async () => {
            const res = await request(app)
                .post('/todos')
                .send({ description: 'Sans titre' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Le titre est obligatoire');
        });
    });

    describe('GET /todos', () => {
        it('devrait lister toutes les todos', async () => {
            await Todo.create({ title: 'Todo 1' });
            await Todo.create({ title: 'Todo 2' });

            const res = await request(app).get('/todos');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /todos/:id', () => {
        it('devrait retourner une todo par son ID', async () => {
            const todo = await Todo.create({ title: 'Todo ID Test' });

            const res = await request(app).get(`/todos/${todo._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Todo ID Test');
        });

        it('devrait retourner 404 pour un ID inexistant', async () => {
            const idInexistant = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/todos/${idInexistant}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /todos/:id', () => {
        it('devrait modifier une todo existante', async () => {
            const todo = await Todo.create({ title: 'Before Update' });

            const res = await request(app)
                .put(`/todos/${todo._id}`)
                .send({ title: 'After Update', completed: true });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('After Update');
            expect(res.body.completed).toBe(true);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('devrait supprimer une todo', async () => {
            const todo = await Todo.create({ title: 'To Be Deleted' });

            const res = await request(app).delete(`/todos/${todo._id}`);
            expect(res.statusCode).toBe(200);

            const count = await Todo.countDocuments();
            expect(count).toBe(0);
        });
    });
});
