import jwt from "jsonwebtoken";
import { CustomError } from "../utils/helpers/index.js";
import AuthService from "../service/AuthService.js";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}

class AuthMiddleware {
  private service: AuthService;
  constructor() {
    this.service = new AuthService();

    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new CustomError({
          statusCode: 498,
          errorType: "authenticationError",
          field: "AuthenticationError",
          details: [],
          customMessage: "O token de autenticação não existe!",
        });
      }

      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        throw new CustomError({
          statusCode: 498,
          errorType: "authenticationError",
          field: "AuthenticationError",
          details: [],
          customMessage: "Formato do token de autenticação inválido!",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS_TOKEN!
      ) as any;

      if (!decoded) {
        throw new CustomError({
          statusCode: 498,
          errorType: "tokenExpiredError",
          field: "TokenExpiredError",
          details: [],
          customMessage: "O token JWT está expirado!",
        });
      }

      const tokenData = await this.service.loadTokens(decoded.id, token);

      if (!tokenData?.data?.refreshtoken) {
        throw new CustomError({
          statusCode: 401,
          errorType: "unauthorized",
          field: "Token",
          details: [],
          customMessage: "Refresh token inválido, autentique novamente!",
        });
      }

      req.user_id = decoded.id;
      next();
    } catch (err) {
      throw new CustomError({
        statusCode: 498,
        errorType: "tokenExpiredError",
        field: "TokenExpiredError",
        details: [],
        customMessage: "Token inválido ou expirado.",
      });
    }
  }
}

export default new AuthMiddleware().handle;
