import UsuarioFilterBuild from "../../../repository/filters/UsuarioFilterBuild";
import { Role } from "../../../models/Usuario";

describe("UsuarioFilterBuild", () => {
  let filterBuilder: UsuarioFilterBuild;

  beforeEach(() => {
    filterBuilder = new UsuarioFilterBuild();
  });

  describe("construtor", () => {
    it("deve inicializar com filtros vazios", () => {
      const filters = filterBuilder.build();
      expect(filters).toEqual({});
    });
  });

  describe("comNome", () => {
    it("deve adicionar filtro de nome quando nome é fornecido", () => {
      const result = filterBuilder.comNome("João Silva");
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.nome).toEqual({ $regex: "João Silva", $options: "i" });
    });

    it("não deve adicionar filtro quando nome é vazio", () => {
      filterBuilder.comNome("");
      const filters = filterBuilder.build();
      expect(filters.nome).toBeUndefined();
    });

    it("não deve adicionar filtro quando nome é undefined", () => {
      filterBuilder.comNome(undefined as any);
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

    it("não deve adicionar filtro quando email é undefined", () => {
      filterBuilder.comEmail(undefined as any);
      const filters = filterBuilder.build();
      expect(filters.email).toBeUndefined();
    });
  });

  describe("comPapel", () => {
    it("deve adicionar filtro de papel quando papel é fornecido", () => {
      const result = filterBuilder.comPapel(Role.ADMIN);
      expect(result).toBe(filterBuilder);

      const filters = filterBuilder.build();
      expect(filters.papel).toEqual({ $regex: Role.ADMIN, $options: "i" });
    });

    it("não deve adicionar filtro quando papel é vazio", () => {
      filterBuilder.comPapel("" as Role);
      const filters = filterBuilder.build();
      expect(filters.papel).toBeUndefined();
    });

    it("não deve adicionar filtro quando papel é undefined", () => {
      filterBuilder.comPapel(undefined as any);
      const filters = filterBuilder.build();
      expect(filters.papel).toBeUndefined();
    });
  });

  describe("combinação de filtros", () => {
    it("deve combinar múltiplos filtros corretamente", () => {
      filterBuilder
        .comNome("João Silva")
        .comEmail("joao@email.com")
        .comPapel(Role.ADMIN);

      const filters = filterBuilder.build();
      expect(filters).toEqual({
        nome: { $regex: "João Silva", $options: "i" },
        email: { $regex: "joao@email.com", $options: "i" },
        papel: { $regex: Role.ADMIN, $options: "i" },
      });
    });

    it("deve permitir filtros parciais", () => {
      filterBuilder.comNome("João").comPapel(Role.AVALIADOR);

      const filters = filterBuilder.build();
      expect(filters).toEqual({
        nome: { $regex: "João", $options: "i" },
        papel: { $regex: Role.AVALIADOR, $options: "i" },
      });
      expect(filters.email).toBeUndefined();
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

  describe("encadeamento de métodos", () => {
    it("deve permitir encadeamento fluente de métodos", () => {
      const result = filterBuilder
        .comNome("Teste")
        .comEmail("teste@email.com")
        .comPapel(Role.AVALIADOR);

      expect(result).toBe(filterBuilder);
    });

    it("deve manter estado entre chamadas encadeadas", () => {
      filterBuilder.comNome("João").comEmail("joao@email.com");

      let filters = filterBuilder.build();
      expect(filters.nome).toBeDefined();
      expect(filters.email).toBeDefined();

      filterBuilder.comPapel(Role.ADMIN);
      filters = filterBuilder.build();
      expect(filters.papel).toBeDefined();
    });
  });
});
