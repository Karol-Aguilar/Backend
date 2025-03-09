import { PrismaClient, User, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecreto";
const TOKEN_EXPIRATION = "5m"; // Expira en 5 minutos

// Generar Token JWT
const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

// Crear usuario (por defecto REGULAR)
export const createUser = async (data: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || "REGULAR", // Asignar REGULAR por defecto
    },
  });

  return { user, token: generateToken(user) };
};

// Obtener todos los usuarios (solo ADMIN puede ver)
export const getAllUsers = async (userRole: string): Promise<User[]> => {
  if (userRole !== "ADMIN") {
    throw new Error("No tienes permiso para ver los usuarios");
  }
  return await prisma.user.findMany({ where: { deletedAt: null } });
};

// Obtener un usuario por ID
export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

// Actualizar usuario (solo ADMIN puede editar)
export const updateUser = async (id: number, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">>, userRole: string) => {
  if (userRole !== "ADMIN") {
    throw new Error("No tienes permiso para editar usuarios");
  }
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await prisma.user.update({ where: { id }, data });
};

// Soft delete (solo ADMIN puede eliminar)
export const softDeleteUser = async (id: number, userRole: string) => {
  if (userRole !== "ADMIN") {
    throw new Error("No tienes permiso para eliminar usuarios");
  }
  return await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
};

// Login con JWT y refresco de token
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Credenciales incorrectas");
  }
  return { user, token: generateToken(user) };
};

// Obtener usuarios por rol
export const getUsersByRole = async (role: Role): Promise<User[]> => {
  return await prisma.user.findMany({
    where: {
      role: role,
    },
  });
};