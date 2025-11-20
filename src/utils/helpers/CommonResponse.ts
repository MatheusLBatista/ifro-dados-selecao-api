import { Response } from "express";
import StatusService from "./StatusService";

interface ErrorItem {
  message: string;
  field?: string;
}

interface ResponseStructure {
  message: string;
  data: any;
  errors: ErrorItem[];
}

class CommonResponse {
  public message: string;
  public data: any;
  public errors: ErrorItem[];

  constructor(message: string, data: any = null, errors: ErrorItem[] = []) {
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  toJSON(): ResponseStructure {
    return {
      message: this.message,
      data: this.data,
      errors: this.errors,
    };
  }

  static success(
    res: Response,
    data: any,
    code: number = 200,
    message: string | null = null
  ): Response {
    const statusMessage = message || StatusService.getHttpCodeMessage(code);
    const response = new CommonResponse(statusMessage, data, []);
    return res.status(code).json(response);
  }

  static error(
    res: Response,
    code: number,
    errorType: string,
    field: string | null = null,
    errors: ErrorItem[] = [],
    customMessage: string | null = null
  ): Response {
    const errorMessage =
      customMessage || (StatusService as any).getErrorMessage(errorType, field);
    const response = new CommonResponse(errorMessage, null, errors);
    return res.status(code).json(response);
  }

  static created(
    res: Response,
    data: any,
    message: string | null = null
  ): Response {
    return this.success(res, data, 201, message);
  }

  static serverError(res: Response, message: string | null = null): Response {
    const errorMessage =
      message || StatusService.getErrorMessage("serverError");
    const response = new CommonResponse(errorMessage, null, []);
    return res.status(500).json(response);
  }

  static getSwaggerSchema(
    schemaRef: string | null = null,
    messageExample: string = "Operação realizada com sucesso"
  ): object {
    return {
      type: "object",
      properties: {
        data: schemaRef
          ? { $ref: schemaRef }
          : { type: "array", items: {}, example: [] },
        message: { type: "string", example: messageExample },
        errors: { type: "array", example: [] },
      },
    };
  }
}

export default CommonResponse;
