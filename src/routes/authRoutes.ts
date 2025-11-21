import express from "express";
import AuthController from "../controller/AuthController";
import asyncWrapper from "../middlewares/asyncWrapper";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const router = express.Router();

const authController = new AuthController();

router
  .post(
    "/login",
    asyncWrapper(authController.login.bind(authController))
  )
  .post(
    "/logout",
    asyncWrapper(authController.logout.bind(authController))
  );

export default router;
