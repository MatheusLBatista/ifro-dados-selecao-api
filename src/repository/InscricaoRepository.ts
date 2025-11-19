import User from "../models/user";

class InscricaoRepository {
  private user: typeof User;

  constructor() {
    this.user = User;
  }

  async create(parsedData: any) {
    console.log("Estou em criar no UsuarioRepository");

    const enrollment = await this.user.create(parsedData);
    return enrollment.save();
  }
}

export default InscricaoRepository;