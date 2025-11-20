import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";
import UsuarioRepository from "../repository/UsuarioRepository";
import { CustomError, HttpStatusCodes } from "../utils/helpers";

class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
  }

  async create(parsedData: UsuarioDTO) {
    console.log("Estou em criar no UsuarioService");
    
    const data = await this.repository.create(parsedData);
    return data;
  }
}

export default UsuarioService;