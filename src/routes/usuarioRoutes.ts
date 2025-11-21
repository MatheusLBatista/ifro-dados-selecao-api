import express from "express";
import UsuarioController from "../controller/UsuarioController";
import asyncWrapper from "../middlewares/asyncWrapper";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AuthPermission from "../middlewares/AuthPermission";

const router = express.Router();

const usuarioController = new UsuarioController();

router
  .post(
    "/usuario", AuthMiddleware, AuthPermission,
    asyncWrapper(usuarioController.create.bind(usuarioController))
  )
  .get("/usuario", AuthMiddleware, AuthPermission, asyncWrapper(usuarioController.read.bind(usuarioController)))
  .get(
    "/usuario/:id", AuthMiddleware, AuthPermission,
    asyncWrapper(usuarioController.read.bind(usuarioController))
  )
  .delete(
    "/usuario/:id", AuthMiddleware, AuthPermission,
    asyncWrapper(usuarioController.delete.bind(usuarioController))
  );

export default router;
