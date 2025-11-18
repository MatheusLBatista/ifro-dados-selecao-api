import dotenv from "dotenv";
import express from "express";

dotenv.config();

const routes = (app: any) => {
  app.get("/", (req: any, res: any) => {
    res.send("API working as planned.");
  });

  app.use(express.json())
};

export default routes;
