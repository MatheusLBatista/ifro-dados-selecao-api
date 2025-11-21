import jwt from "jsonwebtoken";
import { CommonResponse, CustomError, HttpStatusCodes } from "../utils/helpers";
import { LoginSchema } from "../utils/validators/schemas/LoginSchema";
import { Request, Response } from "express";

import AuthService from "../service/AuthService";
import { MongoIdSchema } from "../utils/validators/schemas/queries/MongoIdSchema";

class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const body = req.body;
    const parsedData = LoginSchema.parse(body);
    const data = await this.service.login(parsedData);
    return CommonResponse.success(res, data);
  };

  logout = async (req: Request, res: Response) => {
    const token =
      req.body.access_token || req.headers.authorization?.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      console.log("Token recebido:", token);

      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        errorType: "invalidLogout",
        field: "Logout",
        details: [],
        customMessage: HttpStatusCodes.BAD_REQUEST.message,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS_TOKEN!
    ) as any;

    if (!decoded || !decoded.id) {
      console.log("Token decodificado inválido:", decoded);

      throw new CustomError({
        statusCode: HttpStatusCodes.INVALID_TOKEN.code,
        errorType: "notAuthorized",
        field: "NotAuthorized",
        details: [],
        customMessage: HttpStatusCodes.INVALID_TOKEN.message,
      });
    }

    const decodedId = MongoIdSchema.parse(decoded.id);

    await this.service.logout(decodedId);

    return CommonResponse.success(
      res,
      null,
      200,
      "Logout realizado com sucesso"
    );
  };
}

export default AuthController;
