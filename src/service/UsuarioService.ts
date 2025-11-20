import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";
import UsuarioRepository from "../repository/UsuarioRepository";
import AuthHelper from "../utils/AuthHelper";
import { CustomError, HttpStatusCodes } from "../utils/helpers";

class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
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

  async validateData(nome: string, email: string) {
    const usuarioEmail = await this.repository.findByEmail(email);
    const usuarioNome = await this.repository.findByNome(nome)

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