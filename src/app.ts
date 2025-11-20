// import routes from "./routes/index.js";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
import errorHandler from "./utils/helpers/errorHandler";
// import logger from './utils/logger.js';
// import fileUpload from 'express-fileupload';
import DbConnect from "./config/DbConnect";
import routes from "./routes/index";
import CommonResponse from "./utils/helpers/CommonResponse";
import express from "express";
// import expressFileUpload from 'express-fileupload';

const app = express();

DbConnect.conectar().catch(console.error);

app.use(express.json());
// app.use(expressFileUpload());

routes(app);

app.use((req, res, next) => {
  return CommonResponse.error(res, 404, "resourceNotFound", null, []);
});

app.use(errorHandler);

export default app;
