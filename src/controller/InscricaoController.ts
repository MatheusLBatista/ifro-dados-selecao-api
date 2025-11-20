import InscricaoService from "../service/InscricaoService";
import { Request, Response } from "express";
import { CommonResponse } from "../utils/helpers";
import { InscricaoSchema } from "../utils/validators/schemas/InscricaoSchema";
import { errorHandler } from "../utils/helpers";

class InscricaoController {
  private service: InscricaoService;

  constructor() {
    this.service = new InscricaoService();
  }

  async create(req: Request, res: Response) {
    console.log('Estou no criar em InscricaoController');

    const parsedData = InscricaoSchema.parse(req.body);
    if(!parsedData.success) {
      
    }

    const data = await this.service.create(parsedData);

    return CommonResponse.created(res, data);
  }
}

export default InscricaoController;