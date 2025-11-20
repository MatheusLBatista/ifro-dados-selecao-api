import InscricaoRepository from "../repository/InscricaoRepository";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";
import { CustomError, HttpStatusCodes } from "../utils/helpers";

class InscricaoService {
  private repository: InscricaoRepository;

  constructor() {
    this.repository = new InscricaoRepository();
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no InscricaoService");

    await this.validateData(parsedData.nome, parsedData.email);

    delete parsedData.pontuacao;
    delete parsedData.status;
    const data = await this.repository.create(parsedData);
    return data;
  }

  async validateData(nome: string, email: string) {
    const inscricaoEmail = await this.repository.findByEmail(email);
    const inscricaoNome = await this.repository.findByNome(nome)

    if (inscricaoEmail || inscricaoNome) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        errorType: "validationError",
        field: "email ou nome",
        details: [],
        customMessage: "Nome ou email já inscrito.",
      });
    }
  }
}

export default InscricaoService;
