import errorHandler from "./utils/helpers/errorHandler";
import DbConnect from "./config/DbConnect";
import routes from "./routes/index";
import CommonResponse from "./utils/helpers/CommonResponse";
import express from "express";
import { swaggerUi, specs } from "./docs/utils/swagger";

const app = express();

DbConnect.conectar().catch(console.error);

app.use(express.json());

routes(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res, next) => {
  return CommonResponse.error(res, 404, "resourceNotFound", null, []);
});

app.use(errorHandler);

export default app;
