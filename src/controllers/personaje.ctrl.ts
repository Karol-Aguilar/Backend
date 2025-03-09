import { Request, Response } from "express";
import {
    createPersonajeSrv,
    getListaPersonajeSrv,
    getPersonajeSrv,
    deletePersonajeSrv,
    updatePersonajeSrv
} from "../services/personaje.service";

export const createPersonajeCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await createPersonajeSrv(body);
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

export const getListaPersonajeCtrl = async (req: Request, res: Response) => {
    try {
        const response = await getListaPersonajeSrv();
        res.status(200).json({ msg: "Ejecución correcta", data: response, success: true });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getPersonajeCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await getPersonajeSrv(Number(id));
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

export const deletePersonajeCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await deletePersonajeSrv(parseInt(id));
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

export const updatePersonajeCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await updatePersonajeSrv(body);
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};
