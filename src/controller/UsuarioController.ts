import { Request, Response } from "express";
import { CommonResponse } from "../utils/helpers";
import { UsuarioSchema } from "../utils/validators/schemas/UsuarioSchema";
import UsuarioService from "../service/UsuarioService";
import { MongoIdSchema } from "../utils/validators/schemas/queries/MongoIdSchema";
import { CustomError, HttpStatusCodes } from "../utils/helpers";
import { UsuarioQuerySchema } from "../utils/validators/schemas/queries/UsuarioQuerySchema";

class UsuarioController {
  private service: UsuarioService;

  constructor() {
    this.service = new UsuarioService();
  }

  async read(req: Request, res: Response) {
    const id = req?.params?.id;
    if (id) {
      MongoIdSchema.parse(id);
    }

    const query = req?.query;
    if (Object.keys(query).length !== 0) {
      await UsuarioQuerySchema.parseAsync(query);
    }

    const data = await this.service.read(req);
    return CommonResponse.success(res, data);
  }

  async create(req: Request, res: Response) {
    console.log("Estou no criar em UsuarioController");

    const parsedData = UsuarioSchema.parse(req.body);

    const data = await this.service.create(parsedData);

    return CommonResponse.created(res, data);
  }

  async delete(req: Request, res: Response) {
    const id: string | undefined = req?.params?.id;

    if (!id) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        errorType: "validationError",
        field: "id",
        details: [],
        customMessage: "ID do usuário é obrigatório para deletar.",
      });
    }

    MongoIdSchema.parse(id);

    const data = await this.service.deletar(id, req);
    return CommonResponse.success(
      res,
      data,
      200,
      "Usuário excluído com sucesso."
    );
  }
}

export default UsuarioController;
