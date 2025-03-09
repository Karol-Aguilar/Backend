import { Router } from "express";
import {
  createPersonajeCtrl,
  getListaPersonajeCtrl,
  getPersonajeCtrl,
  deletePersonajeCtrl,
  updatePersonajeCtrl,
} from "../controllers/personaje.ctrl";
const router = Router();

router.post("/", createPersonajeCtrl);

router.get("/list", getListaPersonajeCtrl);

router.get("/only/:id", getPersonajeCtrl);

router.delete("/:id", deletePersonajeCtrl);

router.put("/", updatePersonajeCtrl);

export { router };
