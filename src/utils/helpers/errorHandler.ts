// src/utils/helpers/errorHandler.ts

import { ZodError } from "zod";
import logger from "../logger";
import CommonResponse from "./CommonResponse";
import StatusService from "./StatusService";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
// import AuthenticationError from '../errors/AuthenticationError';
// import TokenExpiredError from '../errors/TokenExpiredError';
import CustomError from "./CustomError";
import { Response, Request, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === "production";
  const errorId = uuidv4();
  const requestId = req.requestId || "N/A";

  // Tratamento para erros de validação do Zod
  if (err instanceof ZodError) {
    logger.warn("Erro de validação", {
      errors: err.errors,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      400,
      "validationError",
      null,
      err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
      `Erro de validação. ${err.errors.length} campo(s) inválido(s).`
    );
  }

  // Tratamento para erro de chave duplicada no MongoDB (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue ? err.keyValue[field] : "duplicado";
    logger.warn("Erro de chave duplicada", {
      field,
      value,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      409,
      "duplicateEntry",
      field,
      [{ path: field, message: `O valor "${value}" já está em uso.` }],
      `Entrada duplicada no campo "${field}".`
    );
  }

  // Tratamento para erros de validação do Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    const detalhes = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    logger.warn("Erro de validação do Mongoose", {
      details: detalhes,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(res, 400, "validationError", null, detalhes);
  }

  // Tratamento específico para CustomError com errorType 'tokenExpired'
  if (err instanceof CustomError && err.errorType === "tokenExpired") {
    logger.warn("Erro de token expirado", {
      message: err.message,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      err.statusCode || 401,
      "tokenExpired",
      null,
      [{ message: err.customMessage || "Token expirado." }],
      err.customMessage || "Token expirado. Por favor, faça login novamente."
    );
  }

  // Tratamento para erros operacionais (erros esperados na aplicação)
  if (err.isOperational) {
    logger.warn("Erro operacional", {
      message: err.message,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      err.statusCode,
      err.errorType || "operationalError",
      err.field || null,
      err.details || [],
      err.customMessage || "Erro operacional."
    );
  }

  // Tratamento para erros internos (não operacionais)
  logger.error(`Erro interno [ID: ${errorId}]`, {
    message: err.message,
    stack: err.stack,
    requestId,
  });
  const detalhes = isProduction
    ? [{ message: `Erro interno do servidor. Referência: ${errorId}` }]
    : [{ message: err.message, stack: err.stack }];

  return CommonResponse.error(res, 500, "serverError", null, detalhes);
};

export default errorHandler;
