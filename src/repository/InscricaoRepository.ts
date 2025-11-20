import Inscricao, { Status } from "../models/Inscricao";
import { InscricaoDTO } from "../utils/validators/schemas/InscricaoSchema";
import { Request } from "express";
import { CustomError, messages } from "../utils/helpers";
import InscricaoFilterBuild from "./filters/InscricaoFilterBuild";

class InscricaoRepository {
  private inscricao: typeof Inscricao;

  constructor() {
    this.inscricao = Inscricao;
  }

  async read(req: Request) {
    const {
      nome,
      email,
      page = "1",
      limite = "10",
    } = req.query;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(limite as string, 10) || 10, 1),
      100
    );

    const filterBuilder = new InscricaoFilterBuild();

    if (nome) filterBuilder.comNome(nome as string);
    if (email) filterBuilder.comEmail(email as string);
    const filtros = filterBuilder.build();

    const options = {
      page: pageNum,
      limit,
      sort: { createdAt: -1 },
      lean: true,
    };

    const PaginatedModel = this.inscricao as any;
    const data = await PaginatedModel.paginate(filtros, options);

    return data;
  }

  async findEvaluated(req: Request) {
    const {
      nome,
      email,
      status,
      pontuacaoMin,
      pontuacaoMax,
      page = "1",
      limite = "10",
    } = req.query;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(limite as string, 10) || 10, 1),
      100
    );

    const filterBuilder = new InscricaoFilterBuild().comPontuacaoAvaliada();

    if (nome) filterBuilder.comNome(nome as string);
    if (email) filterBuilder.comEmail(email as string);
    if (status) filterBuilder.comStatus(status as Status);
    if (pontuacaoMin || pontuacaoMax) {
      filterBuilder.comPontuacaoEntre(
        pontuacaoMin ? Number(pontuacaoMin) : 0,
        pontuacaoMax ? Number(pontuacaoMax) : 10
      );
    }

    const filtros = filterBuilder.build();

    const options = {
      page: pageNum,
      limit,
      sort: { createdAt: -1 },
      lean: true,
    };

    const PaginatedModel = this.inscricao as any;
    const data = await PaginatedModel.paginate(filtros, options);

    return data;
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no InscricaoRepository");

    const inscricao = await this.inscricao.create(parsedData);
    return inscricao.save();
  }

  async evaluate(id: string, parsedData: InscricaoDTO) {
    const user = await this.inscricao.findByIdAndUpdate(id, parsedData, {
      new: true,
    });
    return user;
  }

  async approve(id: string, parsedData: InscricaoDTO) {
    const user = await this.inscricao.findByIdAndUpdate(id, parsedData, {
      new: true,
    });
    return user;
  }

  async findByEmail(email: string): Promise<InscricaoDTO | null> {
    const filtro: object = { email };

    return await this.inscricao.findOne(filtro);
  }

  async findByNome(nome: string): Promise<InscricaoDTO | null> {
    const filtro: object = { nome };

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

  // async findByIdAndEvaluation(id: string) {
  //   let query = this.inscricao.findById(id).find({ pontuacao: { $ne: null } });

  //   const inscricao = await query;

  //   if (!inscricao) {
  //     throw new CustomError({
  //       statusCode: 404,
  //       errorType: "resourceNotFound",
  //       field: "Inscrição",
  //       details: [],
  //       customMessage: messages.error.resourceNotFound("Inscrição"),
  //     });
  //   }

  //   return inscricao;
  // }