import { Request } from "express";
import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";
import UsuarioRepository from "../repository/UsuarioRepository";
import AuthHelper from "../utils/AuthHelper";
import { CustomError, HttpStatusCodes } from "../utils/helpers";
import { UsuarioQuerySchema } from "../utils/validators/schemas/queries/UsuarioQuerySchema";

class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
  }

  async read(req: Request) {
    const { id } = req.params;

    if (id) {
      const data = await this.repository.findById(id);
      return data;
    }

    const query = req.query || {};
    if (Object.keys(query).length !== 0) {
      await UsuarioQuerySchema.parseAsync(query);
    }

    const data = await this.repository.read(req);
    console.log(
      "Estou retornando os dados em UsuarioService para o controller"
    );
    return data;
  }

  async create(parsedData: UsuarioDTO) {
    console.log("Estou em criar no UsuarioService");

    if (parsedData.senha) {
      const { senha: senhaValidada } = await AuthHelper.hashPassword(
        parsedData.senha
      );
      parsedData.senha = senhaValidada;
    }

    await this.validateData(parsedData.nome, parsedData.email);

    const data = await this.repository.create(parsedData);
    return data;
  }

  async deletar(id: string, req: Request) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        errorType: "resourceNotFound",
        field: "Usuário",
        details: [],
        customMessage: "Usuário não encontrado.",
      });
    }

    const data = await this.repository.delete(id);
    return data;
  }

  async validateData(nome: string, email: string) {
    const usuarioEmail = await this.repository.findByEmail(email);
    const usuarioNome = await this.repository.findByNome(nome);

    if (usuarioEmail || usuarioNome) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        errorType: "validationError",
        field: "email ou nome",
        details: [],
        customMessage: "Nome ou email já cadastrados.",
      });
    }
  }
}

export default UsuarioService;
