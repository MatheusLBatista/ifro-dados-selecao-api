import express from "express";
import InscricaoController from "../controller/InscricaoController";
import asyncWrapper from "../middlewares/asyncWrapper";

const router = express.Router();

const inscricaoController = new InscricaoController();

router.post(
  "/inscricao",
  asyncWrapper(inscricaoController.create.bind(inscricaoController))
);

export default router;
