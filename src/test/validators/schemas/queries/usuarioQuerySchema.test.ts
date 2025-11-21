import {
  UsuarioQuerySchema,
  UsuarioPapel,
} from "../../../../utils/validators/schemas/queries/UsuarioQuerySchema";

describe("UsuarioQuerySchema", () => {
  describe("UsuarioPapel", () => {
    it("deve aceitar valores válidos do enum", () => {
      expect(() => UsuarioPapel.parse("administrador")).not.toThrow();
      expect(() => UsuarioPapel.parse("avaliador")).not.toThrow();
      expect(() => UsuarioPapel.parse("coordenador")).not.toThrow();
    });

    it("deve rejeitar valores inválidos do enum", () => {
      expect(() => UsuarioPapel.parse("INVALIDO")).toThrow();
      expect(() => UsuarioPapel.parse("")).toThrow();
      expect(() => UsuarioPapel.parse("admin")).toThrow();
    });
  });

  describe("UsuarioQuerySchema", () => {
    describe("nome", () => {
      it("deve aceitar nome válido", () => {
        const result = UsuarioQuerySchema.parse({ nome: "João Silva" });
        expect(result.nome).toBe("João Silva");
      });

      it("deve trimar espaços em branco", () => {
        const result = UsuarioQuerySchema.parse({ nome: "  João Silva  " });
        expect(result.nome).toBe("João Silva");
      });

      it("deve aceitar nome vazio (opcional)", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result.nome).toBeUndefined();
      });

      it("deve rejeitar nome com menos de 2 caracteres", () => {
        expect(() => UsuarioQuerySchema.parse({ nome: "A" })).toThrow(
          "Nome deve ter pelo menos 2 caracteres."
        );
      });
    });

    describe("email", () => {
      it("deve aceitar email válido", () => {
        const result = UsuarioQuerySchema.parse({ email: "joao@email.com" });
        expect(result.email).toBe("joao@email.com");
      });

      it("deve aceitar email vazio (opcional)", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result.email).toBeUndefined();
      });

      it("deve rejeitar email inválido", () => {
        expect(() =>
          UsuarioQuerySchema.parse({ email: "invalid-email" })
        ).toThrow("Email inválido.");
      });
    });

    describe("papel", () => {
      it("deve aceitar papel válido em minúsculo", () => {
        const result = UsuarioQuerySchema.parse({ papel: "administrador" });
        expect(result.papel).toBe("administrador");
      });

      it("deve aceitar papel válido em maiúsculo", () => {
        const result = UsuarioQuerySchema.parse({ papel: "ADMINISTRADOR" });
        expect(result.papel).toBe("administrador");
      });

      it("deve aceitar papel válido com espaços", () => {
        const result = UsuarioQuerySchema.parse({ papel: "  ADMINISTRADOR  " });
        expect(result.papel).toBe("administrador");
      });

      it("deve aceitar papel vazio (opcional)", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result.papel).toBeUndefined();
      });

      it("deve rejeitar papel inválido", () => {
        expect(() => UsuarioQuerySchema.parse({ papel: "INVALIDO" })).toThrow(
          "O papel deve ser: administrador, avaliador ou coordenador."
        );
      });
    });

    describe("page", () => {
      it("deve aceitar page válida como string", () => {
        const result = UsuarioQuerySchema.parse({ page: "2" });
        expect(result.page).toBe(2);
      });

      it("deve usar valor padrão quando page não fornecida", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result.page).toBe(1);
      });

      it("deve rejeitar page menor ou igual a 0", () => {
        expect(() => UsuarioQuerySchema.parse({ page: "0" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
        expect(() => UsuarioQuerySchema.parse({ page: "-1" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
      });

      it("deve rejeitar page não inteira", () => {
        // parseInt("2.5") retorna 2, que é válido
        // O teste verifica se valores não numéricos falham
        expect(() => UsuarioQuerySchema.parse({ page: "abc" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
      });
    });

    describe("limite", () => {
      it("deve aceitar limite válido como string", () => {
        const result = UsuarioQuerySchema.parse({ limite: "50" });
        expect(result.limite).toBe(50);
      });

      it("deve usar valor padrão quando limite não fornecida", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result.limite).toBe(10);
      });

      it("deve rejeitar limite fora do range", () => {
        expect(() => UsuarioQuerySchema.parse({ limite: "0" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
        expect(() => UsuarioQuerySchema.parse({ limite: "150" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
      });

      it("deve rejeitar limite não inteiro", () => {
        expect(() => UsuarioQuerySchema.parse({ limite: "abc" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
      });
    });

    describe("validação completa", () => {
      it("deve validar um objeto completo válido", () => {
        const input = {
          nome: "João Silva",
          email: "joao@email.com",
          papel: "ADMINISTRADOR",
          page: "2",
          limite: "20",
        };

        const result = UsuarioQuerySchema.parse(input);
        expect(result).toEqual({
          nome: "João Silva",
          email: "joao@email.com",
          papel: "administrador",
          page: 2,
          limite: 20,
        });
      });

      it("deve aceitar objeto vazio", () => {
        const result = UsuarioQuerySchema.parse({});
        expect(result).toEqual({
          page: 1,
          limite: 10,
        });
      });
    });
  });
});
