import Inscricao from "../models/inscricao";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";

class InscricaoRepository {
  private inscricao: typeof Inscricao;

  constructor() {
    this.inscricao = Inscricao;
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no UsuarioRepository");

    const inscricao = await this.inscricao.create(parsedData);
    return inscricao.save();
  }
}

export default InscricaoRepository;
