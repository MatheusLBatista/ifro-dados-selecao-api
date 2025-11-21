import express from "express";
import InscricaoController from "../controller/InscricaoController";
import asyncWrapper from "../middlewares/asyncWrapper";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AuthPermission from "../middlewares/AuthPermission";

const router = express.Router();

const inscricaoController = new InscricaoController();

router
  .post(
    "/inscricao",
    asyncWrapper(inscricaoController.create.bind(inscricaoController))
  )
  .get(
    "/inscricao", AuthMiddleware, AuthPermission,
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .get(
    "/inscricao/avaliadas", AuthMiddleware, AuthPermission,
    asyncWrapper(inscricaoController.findEvaluated.bind(inscricaoController))
  )
  .get(
    "/inscricao/avaliadas/:id", AuthMiddleware, AuthPermission,
    asyncWrapper(inscricaoController.findEvaluated.bind(inscricaoController))
  )
  .get(
    "/inscricao/:id", AuthMiddleware, AuthPermission, 
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/avaliar", AuthMiddleware, AuthPermission,
    asyncWrapper(inscricaoController.evaluate.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/aprovar", AuthMiddleware, AuthPermission,
    asyncWrapper(inscricaoController.approve.bind(inscricaoController))
  );

export default router;
