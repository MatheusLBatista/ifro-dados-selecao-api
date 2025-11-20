import express from "express";
import UsuarioController from "../controller/UsuarioController";
import asyncWrapper from "../middlewares/asyncWrapper";

const router = express.Router();

const usuarioController = new UsuarioController();

router
  .post(
    "/usuario",
    asyncWrapper(usuarioController.create.bind(usuarioController))
  )
  .get("/usuario", asyncWrapper(usuarioController.read.bind(usuarioController)))
  .get(
    "/usuario/:id",
    asyncWrapper(usuarioController.read.bind(usuarioController))
  )
  .delete(
    "/usuario/:id",
    asyncWrapper(usuarioController.delete.bind(usuarioController))
  );

export default router;
