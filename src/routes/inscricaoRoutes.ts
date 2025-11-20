import express from "express";
import InscricaoController from "../controller/InscricaoController";
import asyncWrapper from "../middlewares/asyncWrapper";

const router = express.Router();

const inscricaoController = new InscricaoController();

router
  .post(
    "/inscricao",
    asyncWrapper(inscricaoController.create.bind(inscricaoController))
  )
  .get(
    "/inscricao",
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .get(
    "/inscricao/:id",
    asyncWrapper(inscricaoController.read.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/avaliar",
    asyncWrapper(inscricaoController.evaluate.bind(inscricaoController))
  )
  .patch(
    "/inscricao/:id/aprovar",
    asyncWrapper(inscricaoController.approve.bind(inscricaoController))
  );

export default router;
