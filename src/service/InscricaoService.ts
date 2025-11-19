  import InscricaoRepository from "../repository/InscricaoRepository";

  class InscricaoService {
    private repository: InscricaoRepository;

    constructor() {
      this.repository = new InscricaoRepository();
    }

    async create(parsedData: any) {
      console.log("Estou em criar no UsuarioService");

      const data = await this.repository.create(parsedData);
      return data;
    }
  }

  export default InscricaoService;