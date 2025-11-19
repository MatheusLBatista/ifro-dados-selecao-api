import express from "express";
import InscricaoController from "../controller/InscricaoController";

const router = express.Router();

const inscricaoController = new InscricaoController();

router 
  .post("/inscricao", (req, res) => {
    inscricaoController.create(req, res);
  });

export default router;
