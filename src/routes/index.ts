import dotenv from "dotenv";
import express from "express";
import inscricaoRoutes from "./inscricaoRoutes";

dotenv.config();

const routes = (app: any) => {
  app.get("/", (req: any, res: any) => {
    res.send("API working as planned.");
  });

  app.use(express.json(), inscricaoRoutes);
};

export default routes;
