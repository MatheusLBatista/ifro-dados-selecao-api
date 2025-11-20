import Usuario from "../models/Usuario";
import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";
import { CustomError, messages } from "../utils/helpers";
import { Request } from "express";

class UsuarioRepository {
  private usuario: typeof Usuario;

  constructor() {
    this.usuario = Usuario;
  }

  //TODO: adicionar metodo patch
  async read(req: Request) {
    const { id } = req.params;

    if (id) {
      const data = await this.usuario.findById(id);

      if (!data) {
        throw new CustomError({
          statusCode: 404,
          errorType: "resourceNotFound",
          field: "Usuário",
          details: [],
          customMessage: messages.error.resourceNotFound("Usuário"),
        });
      }

      return data;
    }

    return await this.usuario.find();
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

  async findByEmail(email: string): Promise<UsuarioDTO | null> {
    const filtro: object = { email };

    return await this.usuario.findOne(filtro);
  }

  async findByNome(nome: string): Promise<UsuarioDTO | null> {
    const filtro: object = { nome };

    return await this.usuario.findOne(filtro);
  }

  async findById(id: string, includeTokens = false) {
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
