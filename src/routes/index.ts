import dotenv from "dotenv";
import express from "express";
import inscricaoRoutes from "./inscricaoRoutes";
import usuarioRoutes from "./usuarioRoutes"
import authRoutes from "./authRoutes";
import { Request, Response } from "express";

dotenv.config();

const routes = (app: any) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("API working as planned.");
  });

  app.use(express.json(), inscricaoRoutes, usuarioRoutes, authRoutes);
};

export default routes;
