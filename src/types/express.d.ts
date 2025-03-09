import { Request } from "express";
declare module "express" {
    export interface Request {
      user?: { id: string; role: "admin" | "user" }; // Define el tipo de usuario
    }
  }

export {};