import InscricaoRepository from "../repository/InscricaoRepository";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";
import { CustomError, HttpStatusCodes } from "../utils/helpers";

class InscricaoService {
  private repository: InscricaoRepository;

  constructor() {
    this.repository = new InscricaoRepository();
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no UsuarioService");

    await this.validateEmail(parsedData.email);

    const data = await this.repository.create(parsedData);
    return data;
  }

  async validateEmail(email: string) {
    const inscricao = await this.repository.findByEmail(email);

    if (inscricao) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        errorType: "validationError",
        field: "email",
        details: [],
        customMessage: "Email já inscrito.",
      });
    }
  }
}

export default InscricaoService;
