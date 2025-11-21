import { Role } from "../../models/Usuario";

class UsuarioFilterBuild {
  private filters: any = {};
  constructor() {
    this.filters = {};
  }

  comNome(nome: string) {
    if (nome) {
      this.filters.nome = { $regex: nome, $options: "i" };
    }
    return this;
  }

  comEmail(email: string) {
    if (email) {
      this.filters.email = { $regex: email, $options: "i" };
    }
    return this;
  }

  comPapel(papel: Role) {
    if (papel) {
      this.filters.papel = { $regex: papel, $options: "i" };
    }

    return this;
  }

  build() {
    return { ...this.filters };
  }
}

export default UsuarioFilterBuild;
