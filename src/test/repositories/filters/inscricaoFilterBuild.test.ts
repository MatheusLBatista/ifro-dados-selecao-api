import InscricaoFilterBuild from "../../../repository/filters/InscricaoFilterBuild";
import { Status } from "../../../models/Inscricao";

describe("InscricaoFilterBuild", () => {
  let filterBuilder: InscricaoFilterBuild;

  beforeEach(() => {
    filterBuilder = new InscricaoFilterBuild();
  });

  describe("construtor", () => {
    it("deve inicializar com filtros vazios", () => {
      const filters = filterBuilder.build();
      expect(filters).toEqual({});
    });
  });

  describe("comStatus", () => {
    it("deve adicionar filtro de status quando status é fornecido", () => {
      const result = filterBuilder.comStatus(Status.PENDENTE);
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.status).toEqual({
        $regex: Status.PENDENTE,
        $options: "i",
      });
    });

    it("não deve adicionar filtro quando status é vazio", () => {
      filterBuilder.comStatus("" as Status);
      const filters = filterBuilder.build();
      expect(filters.status).toBeUndefined();
    });
  });

  describe("comNome", () => {
    it("deve adicionar filtro de nome quando nome é fornecido", () => {
      const result = filterBuilder.comNome("João");
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.nome).toEqual({ $regex: "João", $options: "i" });
    });

    it("não deve adicionar filtro quando nome é vazio", () => {
      filterBuilder.comNome("");
      const filters = filterBuilder.build();
      expect(filters.nome).toBeUndefined();
    });
  });

  describe("comEmail", () => {
    it("deve adicionar filtro de email quando email é fornecido", () => {
      const result = filterBuilder.comEmail("joao@email.com");
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.email).toEqual({
        $regex: "joao@email.com",
        $options: "i",
      });
    });

    it("não deve adicionar filtro quando email é vazio", () => {
      filterBuilder.comEmail("");
      const filters = filterBuilder.build();
      expect(filters.email).toBeUndefined();
    });
  });

  describe("comPontuacaoMinima", () => {
    it("deve adicionar filtro de pontuação mínima quando valor é válido", () => {
      const result = filterBuilder.comPontuacaoMinima(50);
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.pontuacao).toEqual({ $gte: 50 });
    });

    it("não deve adicionar filtro quando valor é null", () => {
      filterBuilder.comPontuacaoMinima(null as any);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });

    it("não deve adicionar filtro quando valor é NaN", () => {
      filterBuilder.comPontuacaoMinima(NaN);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });

    it("não deve adicionar filtro quando valor é negativo", () => {
      filterBuilder.comPontuacaoMinima(-10);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });
  });

  describe("comPontuacaoMaxima", () => {
    it("deve adicionar filtro de pontuação máxima quando valor é válido", () => {
      const result = filterBuilder.comPontuacaoMaxima(100);
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.pontuacao).toEqual({ $lte: 100 });
    });

    it("não deve adicionar filtro quando valor é null", () => {
      filterBuilder.comPontuacaoMaxima(null as any);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });

    it("não deve adicionar filtro quando valor é NaN", () => {
      filterBuilder.comPontuacaoMaxima(NaN);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });

    it("não deve adicionar filtro quando valor é negativo", () => {
      filterBuilder.comPontuacaoMaxima(-10);
      const filters = filterBuilder.build();
      expect(filters.pontuacao).toBeUndefined();
    });
  });

  describe("comPontuacaoEntre", () => {
    it("deve adicionar filtro de pontuação entre dois valores", () => {
      const result = filterBuilder.comPontuacaoEntre(50, 100);
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.pontuacao).toEqual({ $gte: 50, $lte: 100 });
    });
  });

  describe("comPontuacaoAvaliada", () => {
    it("deve adicionar filtro para pontuações avaliadas", () => {
      const result = filterBuilder.comPontuacaoAvaliada();
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.pontuacao).toEqual({ $ne: null });
    });
  });

  describe("combinação de filtros", () => {
    it("deve combinar múltiplos filtros corretamente", () => {
      filterBuilder
        .comNome("João")
        .comEmail("joao@email.com")
        .comStatus(Status.APROVADO)
        .comPontuacaoEntre(70, 90);

      const filters = filterBuilder.build();
      expect(filters).toEqual({
        nome: { $regex: "João", $options: "i" },
        email: { $regex: "joao@email.com", $options: "i" },
        status: { $regex: Status.APROVADO, $options: "i" },
        pontuacao: { $gte: 70, $lte: 90 },
      });
    });
  });

  describe("build", () => {
    it("deve retornar os filtros construídos", () => {
      const filters = filterBuilder.build();
      expect(typeof filters).toBe("object");
    });

    it("deve retornar uma nova referência a cada chamada", () => {
      const filters1 = filterBuilder.build();
      const filters2 = filterBuilder.build();
      expect(filters1).not.toBe(filters2);
      expect(filters1).toEqual(filters2);
    });
  });
});
