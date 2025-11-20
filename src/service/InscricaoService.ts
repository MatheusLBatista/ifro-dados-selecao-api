import InscricaoRepository from "../repository/InscricaoRepository";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";

class InscricaoService {
  private repository: InscricaoRepository;

  constructor() {
    this.repository = new InscricaoRepository();
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no UsuarioService");

    const data = await this.repository.create(parsedData);
    return data;
  }
}

export default InscricaoService;
