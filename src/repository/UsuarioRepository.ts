import Usuario from "../models/Usuario";
import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";
import { CustomError, messages } from "../utils/helpers";
import { Request } from "express";
import UsuarioFilterBuild from "./filters/UsuarioFilterBuild";
import { Role } from "../models/Usuario";

class UsuarioRepository {
  private usuario: typeof Usuario;

  constructor() {
    this.usuario = Usuario;
  }

  async saveTokens(id: string, accesstoken: string, refreshtoken: string) {
    const document = await this.usuario.findById(id);
    if (!document) {
      throw new CustomError({
        statusCode: 401,
        errorType: "resourceNotFound",
        field: "Usuário",
        details: [],
        customMessage: messages.error.resourceNotFound("Usuário"),
      });
    }
    document.accesstoken = accesstoken;
    document.refreshtoken = refreshtoken;
    const data = document.save();
    return data;
  }

  async removerTokens(id: string) {
    const parsedData = {
      refreshtoken: null,
      accesstoken: null,
    };

    const usuario = await this.usuario
      .findByIdAndUpdate(id, parsedData, { new: true })
      .exec();

    if (!usuario) {
      throw new CustomError({
        statusCode: 404,
        errorType: "resourceNotFound",
        field: "Usuário",
        details: [],
        customMessage: messages.error.resourceNotFound("Usuário"),
      });
    }

    return usuario;
  }

  //TODO: adicionar metodo patch
  async read(req: Request) {
    const { nome, email, papel, page = "1", limite = "10" } = req.query;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(limite as string, 10) || 10, 1),
      100
    );

    const filterBuilder = new UsuarioFilterBuild();

    if (nome) filterBuilder.comNome(nome as string);
    if (email) filterBuilder.comEmail(email as string);
    if (papel) filterBuilder.comPapel(papel as Role);
    const filtros = filterBuilder.build();

    const options = {
      page: pageNum,
      limit,
      sort: { createdAt: -1 },
      lean: true,
    };

    const PaginatedModel = this.usuario as any;
    const data = await PaginatedModel.paginate(filtros, options);

    return data;
  }

  async create(parsedData: UsuarioDTO) {
    console.log("Estou em criar no UsuarioRepository");

    const usuario = await this.usuario.create(parsedData);
    return usuario.save();
  }

  async delete(id: string) {
    const user = await this.usuario.findByIdAndDelete(id);
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    return await this.usuario.findOne({ email }).select("+senha");
  }

  async findByNome(nome: string): Promise<UsuarioDTO | null> {
    const filtro: object = { nome };

    return await this.usuario.findOne(filtro);
  }

  async findById(id: string, includeTokens = false): Promise<any> {
    let query = this.usuario.findById(id);

    if (includeTokens) {
      query = query.select("+refreshtoken +accesstoken");
    }

    const user = await query;

    if (!user) {
      throw new CustomError({
        statusCode: 404,
        errorType: "resourceNotFound",
        field: "Usuário",
        details: [],
        customMessage: messages.error.resourceNotFound("Usuário"),
      });
    }

    return user;
  }
}

export default UsuarioRepository;
