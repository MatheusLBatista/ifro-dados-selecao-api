// src/utils/helpers/CommonResponse.ts

import { Response } from "express";
import StatusService from "./StatusService";

interface ErrorItem {
  message: string;
  field?: string;
}

class CommonResponse {
  message: string;
  data: any;
  errors: ErrorItem[];

  constructor(message: string, data: any = null, errors: ErrorItem[] = []) {
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  toJSON() {
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
  ) {
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
  ) {
    const errorMessage =
      customMessage || (StatusService as any).getErrorMessage(errorType, field);
    const response = new CommonResponse(errorMessage, null, errors);
    return res.status(code).json(response);
  }

  static created(res: Response, data: any, message: string | null = null) {
    return this.success(res, data, 201, message);
  }

  static serverError(res: Response, message: string | null = null) {
    const errorMessage =
      message || StatusService.getErrorMessage("serverError");
    const response = new CommonResponse(errorMessage, null, []);
    return res.status(500).json(response);
  }

  /**
   * Retorna o schema para o Swagger baseado na estrutura do CommonResponse.
   *
   * @param {string|null} schemaRef - Referência para o schema do "data", se houver.
   * @param {string} messageExample - Exemplo de mensagem para o Swagger.
   * @returns {object} Schema JSON da resposta.
   */
  static getSwaggerSchema(
    schemaRef = null,
    messageExample = "Operação realizada com sucesso"
  ) {
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
