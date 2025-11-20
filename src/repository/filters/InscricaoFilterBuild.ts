import { Status } from "../../models/Inscricao";

class InscricaoFilterBuild {
  private filters: any = {};
  constructor() {
    this.filters = {};
  }

  comStatus(status: Status) {
    if (status) {
      this.filters.status = { $regex: status, $options: "i" };
    }

    return this;
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

  comPontuacaoMinima(min: number) {
    if (min == null || isNaN(min) || min < 0) return this;

    this.filters.pontuacao = {
      ...this.filters.pontuacao,
      $gte: min,
    };

    return this;
  }

  comPontuacaoMaxima(max: number) {
    if (max == null || isNaN(max) || max < 0) return this;

    this.filters.pontuacao = {
      ...this.filters.pontuacao,
      $lte: max,
    };

    return this;
  }

  comPontuacaoEntre(min: number, max: number) {
    return this.comPontuacaoMinima(min).comPontuacaoMaxima(max);
  }

  comPontuacaoAvaliada() {
    this.filters.pontuacao = { $ne: null };
    return this;
  }

  build() {
    return this.filters;
  }
}

export default InscricaoFilterBuild;
