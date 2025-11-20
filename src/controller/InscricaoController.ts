import InscricaoService from "../service/InscricaoService";
import { Request, Response } from "express";
import { CommonResponse } from "../utils/helpers";
import {
  InscricaoSchema,
  InscricaoUpdateSchema,
} from "../utils/validators/schemas/InscricaoSchema";
import { MongoIdSchema } from "../utils/validators/schemas/queries/MongoIdSchema";

class InscricaoController {
  private service: InscricaoService;

  constructor() {
    this.service = new InscricaoService();
  }

  async read(req: Request, res: Response) {
    const id = req?.params?.id;
    if (id) {
      MongoIdSchema.parse(id);
    }

    //TODO: revisar queries em inscricao
    // const query = req?.query;
    // if (Object.keys(query).length !== 0) {
    //   await UsuarioQuerySchema.parseAsync(query);
    // }

    const data = await this.service.read(req);
    return CommonResponse.success(res, data);
  }

  async create(req: Request, res: Response) {
    console.log("Estou no criar em InscricaoController");

    const parsedData = InscricaoSchema.parse(req.body);

    const data = await this.service.create(parsedData);

    return CommonResponse.created(res, data);
  }

  async evaluate(req: Request, res: Response) {
    const id: string | undefined = req?.params?.id;
    MongoIdSchema.parse(id);

    const parsedData = InscricaoUpdateSchema.parse(req.body);

    const data = await this.service.evaluate(id!, parsedData);

    let cleanInscricao = data?.toObject();

    return CommonResponse.success(
      res,
      cleanInscricao,
      200,
      "Usuário avaliado com sucesso."
    );
  }
}

export default InscricaoController;
