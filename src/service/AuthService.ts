import jwt from "jsonwebtoken";
import { CustomError } from "../utils/helpers";
import TokenUtil from "../utils/TokenUtil";
import bcrypt from "bcrypt";

import UsuarioRepository from "../repository/UsuarioRepository";

class AuthService {
  private TokenUtil: typeof TokenUtil;
  private repository: UsuarioRepository;

  constructor(params: any = {}) {
    const { tokenUtil: injectedToken } = params;
    this.TokenUtil = injectedToken || TokenUtil;
    this.repository = new UsuarioRepository();
  }

  async loadTokens(id: string, token: string) {
    const data = await this.repository.findById(id, true);
    return { data };
  }

  async login(body: any) {
    const usuario = await this.repository.findByEmail(body.email);
    if (!usuario) {
      throw new CustomError({
        statusCode: 401,
        errorType: "notFound",
        field: "Email",
        details: [],
        customMessage: "Credenciais inválidas",
      });
    }

    const senhaValida = await bcrypt.compare(body.senha, usuario.senha);
    if (!senhaValida) {
      throw new CustomError({
        statusCode: 401,
        errorType: "notFound",
        field: "Senha",
        details: [],
        customMessage: "Credenciais inválidas",
      });
    }

    const accessToken = await this.TokenUtil.generateAccessToken(usuario._id);

    const userComToken = await this.repository.findById(usuario._id, true);
    let refreshtoken = userComToken.refreshtoken;
    console.log("refresh token no banco", refreshtoken);

    if (refreshtoken) {
      try {
        jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH_TOKEN!);
      } catch (error: any) {
        if (
          error.name === "TokenExpiredError" ||
          error.name === "JsonWebTokenError"
        ) {
          refreshtoken = await this.TokenUtil.generateRefreshToken(usuario._id);
        } else {
          throw new CustomError({
            statusCode: 500,
            errorType: "ServerError",
            field: "Token",
            details: [],
            customMessage: "Falha na criação do token",
          });
        }
      }
    } else {
      refreshtoken = await this.TokenUtil.generateRefreshToken(usuario._id);
    }

    console.log("refresh token gerado", refreshtoken);

    await this.repository.saveTokens(usuario._id, accessToken, refreshtoken);

    const userLogado = await this.repository.findByEmail(body.email);
    delete userLogado.senha;

    const userObject = userLogado.toObject();

    return { user: { accessToken, refreshtoken, ...userObject } };
  }

  async logout(id: string) {
    const data = await this.repository.removerTokens(id);
    return { data };
  }
}

export default AuthService;
