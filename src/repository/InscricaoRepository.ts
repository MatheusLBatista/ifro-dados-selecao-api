import Inscricao from "../models/Inscricao";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";
import { Request } from "express";
import { CustomError, messages } from "../utils/helpers";

class InscricaoRepository {
  private inscricao: typeof Inscricao;

  constructor() {
    this.inscricao = Inscricao;
  }

  async read(req: Request) {
    const { id } = req.params;

    if (id) {
      const data = await this.inscricao.findById(id);

      if (!data) {
        throw new CustomError({
          statusCode: 404,
          errorType: "resourceNotFound",
          field: "Inscrição",
          details: [],
          customMessage: messages.error.resourceNotFound("Inscrição"),
        });
      }

      return data;
    }

    return await this.inscricao.find();
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no InscricaoRepository");

    const inscricao = await this.inscricao.create(parsedData);
    return inscricao.save();
  }

  async evaluate(id: string, parsedData: InscricaoDTO) {
    const user = await this.inscricao.findByIdAndUpdate(id, parsedData, {new: true});
    return user;
  }

  async findByEmail(email: string): Promise<InscricaoDTO | null> {
    const filtro: object = { email }

    return await this.inscricao.findOne(filtro);
  }

  async findByNome(nome: string): Promise<InscricaoDTO | null> {
    const filtro: object = { nome }

    return await this.inscricao.findOne(filtro);
  }

  async findById(id: string) {
      let query = this.inscricao.findById(id);
  
      const inscricao = await query;
  
      if (!inscricao) {
        throw new CustomError({
          statusCode: 404,
          errorType: "resourceNotFound",
          field: "Inscrição",
          details: [],
          customMessage: messages.error.resourceNotFound("Inscrição"),
        });
      }
  
      return inscricao;
    }
}

export default InscricaoRepository;
