import { Request, Response } from "express";
import { CommonResponse } from "../utils/helpers";
import { UsuarioSchema } from "../utils/validators/schemas/UsuarioSchema";
import UsuarioService from "../service/UsuarioService";

class UsuarioController {
  private service: UsuarioService;

  constructor() {
    this.service = new UsuarioService();
  }

  async create(req: Request, res: Response) {
    console.log("Estou no criar em UsuarioController");

    const parsedData = UsuarioSchema.parse(req.body);

    const data = await this.service.create(parsedData);

    return CommonResponse.created(res, data);
  }
}

export default UsuarioController;