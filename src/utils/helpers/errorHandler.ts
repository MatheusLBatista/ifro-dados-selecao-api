// src/utils/helpers/errorHandler.ts
import { ZodError } from "zod";
import logger from "../logger";
import CommonResponse from "./CommonResponse";
import mongoose from "mongoose";
import CustomError from "./CustomError";
import { Response, Request, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

interface MongoError extends Error {
  code?: number;
  keyValue?: { [key: string]: any };
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === "production";
  const requestId = req.requestId || "N/A";
  
  if (err instanceof ZodError) {
    logger.warn("Erro de validação", {
      errors: err.issues,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      400,
      "validationError",
      null,
      err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      `Erro de validação. ${err.issues.length} campo(s) inválido(s).`
    );
  }
  
  if ((err as MongoError).code === 11000) {
    const mongoErr = err as MongoError;
    const field = mongoErr.keyValue
      ? Object.keys(mongoErr.keyValue)[0]
      : "campo";
    const value =
      mongoErr.keyValue && field ? mongoErr.keyValue[field] : "duplicado";
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
      [
        {
          field: field || "campo",
          message: `O valor "${value}" já está em uso.`,
        },
      ],
      `Entrada duplicada no campo "${field}".`
    );
  }
  
  if (err instanceof mongoose.Error.ValidationError) {
    const detalhes = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    logger.warn("Erro de validação do Mongoose", {
      details: detalhes,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(res, 400, "validationError", null, detalhes);
  }
  
  if (err instanceof CustomError) {
    logger.warn("Erro customizado", {
      message: err.message,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      err.statusCode || 400,
      err.errorType || "customError",
      err.field || null,
      [{ message: err.customMessage || err.message }],
      err.customMessage || err.message
    );
  }
  
  if ((err as any).isOperational) {
    logger.warn("Erro operacional", {
      message: err.message,
      path: req.path,
      requestId,
    });
    return CommonResponse.error(
      res,
      (err as any).statusCode || 500,
      (err as any).errorType || "operationalError",
      (err as any).field || null,
      (err as any).details || [],
      (err as any).customMessage || "Erro operacional."
    );
  }
  
  logger.error(`Erro interno`, {
    message: err.message,
    stack: err.stack,
    requestId,
  });
  const detalhes = isProduction
    ? [{ message: `Erro interno do servidor.` }]
    : [{ message: err.message, stack: err.stack }];

  return CommonResponse.error(res, 500, "serverError", null, detalhes);
};

export default errorHandler;
