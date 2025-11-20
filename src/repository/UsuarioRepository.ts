import Usuario from "../models/Usuario";
import { UsuarioDTO } from "../utils/validators/schemas/UsuarioSchema";

class UsuarioRepository {
  private usuario: typeof Usuario;

  constructor() {
    this.usuario = Usuario;
  }

  async create(parsedData: UsuarioDTO) {
      console.log("Estou em criar no UsuarioRepository");
  
      const usuario = await this.usuario.create(parsedData);
      return usuario.save();
    }
}

export default UsuarioRepository;