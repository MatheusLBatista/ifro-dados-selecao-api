import jwt from "jsonwebtoken";
import { CustomError } from "../utils/helpers";
import { Request, Response, NextFunction } from "express";
import UsuarioRepository from "../repository/UsuarioRepository";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        papel: string;
      };
    }
  }
}

const ROUTE_RULES: Record<string, Record<string, string[]>> = {
  "/inscricao": {
    GET: ["administrador", "coordenador", "avaliador"],
  },
  "/inscricao/avaliadas": {
    GET: ["administrador", "coordenador"],
  },
  "/inscricao/avaliadas/:id": {
    GET: ["administrador", "coordenador"],
  },
  "/inscricao/:id": {
    GET: ["administrador", "coordenador", "avaliador"],
  },
  "/inscricao/:id/avaliar": {
    PATCH: ["administrador", "avaliador"],
  },
  "/inscricao/:id/aprovar": {
    PATCH: ["administrador", "coordenador"],
  },
  "/usuario": {
    GET: ["administrador", "coordenador"],
    POST: ["administrador"],
  },
  "/usuario/:id": {
    GET: ["administrador", "coordenador"],
    PATCH: ["administrador"],
    DELETE: ["administrador"],
  },
};

class AuthPermission {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer "))
        throw new CustomError({
          statusCode: 401,
          errorType: "authenticationError",
          field: "AuthenticationError",
          details: [],
          customMessage: "Token requerido.",
        });

      const token = header.split(" ")[1];

      if (!process.env.JWT_SECRET_ACCESS_TOKEN) {
        throw new CustomError({
          statusCode: 401,
          errorType: "authenticationError",
          field: "AuthenticationError",
          details: [],
          customMessage: "Token não configurado.",
        });
      }

      const decoded = (jwt.verify as any)(
        token,
        process.env.JWT_SECRET_ACCESS_TOKEN
      );

      const usuario = await this.repository.findById(decoded.id);
    
      const papel = usuario.papel.toLowerCase();

      const basePath = req.baseUrl;
      const routePath = req.route?.path || "";
      const fullPath =
        (basePath + routePath).replace(/\/:id/g, "/[id]").replace(/\/+$/, "") ||
        "/";

      const regraRota = Object.keys(ROUTE_RULES).find((rota) => {
        const regex = new RegExp("^" + rota.replace(/:id/g, "[^/]+") + "$");
        return regex.test(fullPath);
      });

      if (!regraRota) {
        req.user = { id: usuario._id.toString(), papel };
        return next();
      }

      const metodo = req.method;
      const rolesPermitidos = regraRota
        ? ROUTE_RULES[regraRota]?.[metodo]
        : undefined;

      if (!rolesPermitidos || !rolesPermitidos.includes(papel)) {
        throw new CustomError({
          statusCode: 403,
          customMessage:
            "Acesso negado. Você não tem permissão para esta ação.",
        });
      }

      req.user = { id: usuario._id.toString(), papel };
      next();
    } catch (err: any) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        throw new CustomError({
          statusCode: 498,
          errorType: "tokenExpiredError",
          field: "TokenExpiredError",
          details: [],
          customMessage: "Token inválido ou expirado.",
        });
      }

      if (err instanceof CustomError) {
        throw err;
      }

      throw new CustomError({
        statusCode: 401,
        errorType: "authenticationError",
        field: "AuthenticationError",
        details: [],
        customMessage: "Erro de autenticação.",
      });
    }
  }
}

export default new AuthPermission().handle;
