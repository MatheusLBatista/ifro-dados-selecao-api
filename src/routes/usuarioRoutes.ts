import express from "express";
import UsuarioController from "../controller/UsuarioController";
import asyncWrapper from "../middlewares/asyncWrapper";

const router = express.Router();

const usuarioController = new UsuarioController();

router.post(
  "/usuario",
  asyncWrapper(usuarioController.create.bind(usuarioController))
);

export default router;
