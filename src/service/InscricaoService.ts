import InscricaoRepository from "../repository/InscricaoRepository";
import {
  InscricaoDTO,
  InscricaoUpdateDTO,
} from "../utils/validators/schemas/InscricaoSchema";
import { CustomError, HttpStatusCodes } from "../utils/helpers";
import { Request } from "express";
import { InscricaoQuerySchema } from "../utils/validators/schemas/queries/InscricaoQuerySchema";

class InscricaoService {
  private repository: InscricaoRepository;

  constructor() {
    this.repository = new InscricaoRepository();
  }

  async read(req: Request) {
    const { id } = req.params;

    if (id) {
      const data = await this.repository.findById(id);
      return data;
    }

    const query = req.query || {};
    if (Object.keys(query).length !== 0) {
      await InscricaoQuerySchema.parseAsync(query);
    }

    const data = await this.repository.read(req);

    return data;
  }

  async findEvaluated(req: Request) {
    const { id } = req.params;

    if (id) {
      const data = await this.repository.findById(id);

      return data;
    }

    const query = req.query || {};
    if (Object.keys(query).length !== 0) {
      await InscricaoQuerySchema.parseAsync(query);
    }

    const data = await this.repository.findEvaluated(req);

    return data;
  }

  async create(parsedData: InscricaoDTO) {
    console.log("Estou em criar no InscricaoService");

    await this.validateData(parsedData.nome, parsedData.email);

    delete parsedData.pontuacao;
    delete parsedData.status;
    const data = await this.repository.create(parsedData);
    return data;
  }

  async evaluate(id: string, parsedData: InscricaoUpdateDTO) {
    const { pontuacao } = parsedData;

    this.maintainPermittedFields(parsedData, ["pontuacao"]);

    const data = await this.repository.evaluate(id, { pontuacao } as any);
    return data;
  }

  async approve(id: string, parsedData: InscricaoUpdateDTO) {
    const { status } = parsedData;

    this.maintainPermittedFields(parsedData, ["status"]);

    const data = await this.repository.approve(id, { status } as any);
    return data;
  }

  maintainPermittedFields(obj: any, permittedFields: string[]) {
    Object.keys(obj).forEach((key) => {
      if (!permittedFields.includes(key)) {
        delete (obj as any)[key];
      }
    });
  }

  async validateData(nome: string, email: string) {
    const inscricaoEmail = await this.repository.findByEmail(email);
    const inscricaoNome = await this.repository.findByNome(nome);

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
