import Inscricao from "../models/Inscricao";
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

  async findByEmail(email: string): Promise<InscricaoDTO | null> {
    const filtro: object = { email }

    return await this.inscricao.findOne(filtro);
  }

  async findByNome(nome: string): Promise<InscricaoDTO | null> {
    const filtro: object = { nome }

    return await this.inscricao.findOne(filtro);
  }
}

export default InscricaoRepository;
