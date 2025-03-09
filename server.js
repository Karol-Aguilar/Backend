import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto';

app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

// Ruta de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ user, token });
});

// Rutas CRUD para personajes
app.get('/personajes', authMiddleware, async (req, res) => {
  const personajes = await prisma.personaje.findMany();
  res.json(personajes);
});

app.post('/personajes', authMiddleware, async (req, res) => {
  const { nombre, foto } = req.body;
  const personaje = await prisma.personaje.create({ data: { nombre, foto } });
  res.json(personaje);
});

app.put('/personajes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nombre, foto } = req.body;
  const personaje = await prisma.personaje.update({ where: { id: Number(id) }, data: { nombre, foto } });
  res.json(personaje);
});

app.delete('/personajes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.personaje.delete({ where: { id: Number(id) } });
  res.json({ message: 'Personaje eliminado' });
});

// Eliminar la llamada a app.listen
// const PORT = process.env.PORT || 3030;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;