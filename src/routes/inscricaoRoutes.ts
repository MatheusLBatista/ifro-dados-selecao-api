import express from "express";
import InscricaoController from "../controller/InscricaoController";
import asyncWrapper from "../middlewares/asyncWrapper";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const router = express.Router();

const inscricaoController = new InscricaoController();

router
  .post(
    "/inscricao", AuthMiddleware,
    asyncWrapper(inscricaoController.create.bind(inscricaoController))
  )
  .get(
    "/inscricao", AuthMiddleware,
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .get(
    "/inscricao/avaliadas", AuthMiddleware,
    asyncWrapper(inscricaoController.findEvaluated.bind(inscricaoController))
  )
  .get(
    "/inscricao/avaliadas/:id", AuthMiddleware,
    asyncWrapper(inscricaoController.findEvaluated.bind(inscricaoController))
  )
  .get(
    "/inscricao/:id", AuthMiddleware,
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/avaliar", AuthMiddleware,
    asyncWrapper(inscricaoController.evaluate.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/aprovar", AuthMiddleware,
    asyncWrapper(inscricaoController.approve.bind(inscricaoController))
  );

export default router;
