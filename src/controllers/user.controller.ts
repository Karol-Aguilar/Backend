import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  getUsersByRole, // Importar la función getUsersByRole
} from "../services/user.service";

import { Role } from '@prisma/client';

// Registrar usuario
export const registerUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await createUser({ ...req.body, role: "REGULAR" });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios
export const getUsersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    const users = await getAllUsers(userRole);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por ID
export const getUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario
export const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    const user = await updateUser(Number(req.params.id), req.body, userRole);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario (soft delete)
export const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    const user = await softDeleteUser(Number(req.params.id), userRole);
    res.status(200).json({ message: "Usuario eliminado (soft delete)", user });
  } catch (error) {
    next(error);
  }
};

// Obtener usuarios por rol
export const getUsersByRoleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.params;
    const users = await getUsersByRole(role as Role);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};