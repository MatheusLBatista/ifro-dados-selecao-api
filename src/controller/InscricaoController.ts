import InscricaoService from "../service/InscricaoService";
import { Request, Response } from "express";
import { CommonResponse } from "../utils/helpers";

class InscricaoController {
  private service: InscricaoService;

  constructor() {
    this.service = new InscricaoService();
  }

  async create(req: Request, res: Response) {
    console.log('Estou no criar em InscricaoController');

    const parsedData = req.body;
    const data = await this.service.create(parsedData);

    return CommonResponse.created(res, data);
  }
}

export default InscricaoController;