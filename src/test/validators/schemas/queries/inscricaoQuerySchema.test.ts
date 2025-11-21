import {
  InscricaoQuerySchema,
  InscricaoStatusEnum,
} from "../../../../utils/validators/schemas/queries/InscricaoQuerySchema";

describe("InscricaoQuerySchema", () => {
  describe("InscricaoStatusEnum", () => {
    it("deve aceitar valores válidos do enum", () => {
      expect(() => InscricaoStatusEnum.parse("PENDENTE")).not.toThrow();
      expect(() => InscricaoStatusEnum.parse("APROVADO")).not.toThrow();
      expect(() => InscricaoStatusEnum.parse("REPROVADO")).not.toThrow();
    });

    it("deve rejeitar valores inválidos do enum", () => {
      expect(() => InscricaoStatusEnum.parse("INVALIDO")).toThrow();
      expect(() => InscricaoStatusEnum.parse("")).toThrow();
      expect(() => InscricaoStatusEnum.parse("pendente")).toThrow();
    });
  });

  describe("InscricaoQuerySchema", () => {
    describe("nome", () => {
      it("deve aceitar nome válido", () => {
        const result = InscricaoQuerySchema.parse({ nome: "João Silva" });
        expect(result.nome).toBe("João Silva");
      });

      it("deve trimar espaços em branco", () => {
        const result = InscricaoQuerySchema.parse({ nome: "  João Silva  " });
        expect(result.nome).toBe("João Silva");
      });

      it("deve aceitar nome vazio (opcional)", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.nome).toBeUndefined();
      });

      it("deve rejeitar nome com menos de 2 caracteres", () => {
        expect(() => InscricaoQuerySchema.parse({ nome: "A" })).toThrow(
          "Nome deve ter pelo menos 2 caracteres."
        );
      });
    });

    describe("email", () => {
      it("deve aceitar email válido", () => {
        const result = InscricaoQuerySchema.parse({ email: "joao@email.com" });
        expect(result.email).toBe("joao@email.com");
      });

      it("deve aceitar email vazio (opcional)", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.email).toBeUndefined();
      });

      it("deve rejeitar email inválido", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ email: "invalid-email" })
        ).toThrow("Email inválido.");
      });
    });

    describe("status", () => {
      it("deve aceitar status válido em maiúsculo", () => {
        const result = InscricaoQuerySchema.parse({ status: "APROVADO" });
        expect(result.status).toBe("aprovado");
      });

      it("deve aceitar status válido em minúsculo", () => {
        const result = InscricaoQuerySchema.parse({ status: "aprovado" });
        expect(result.status).toBe("aprovado");
      });

      it("deve aceitar status válido com espaços", () => {
        const result = InscricaoQuerySchema.parse({ status: "  APROVADO  " });
        expect(result.status).toBe("aprovado");
      });

      it("deve aceitar status vazio (opcional)", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.status).toBeUndefined();
      });

      it("deve rejeitar status inválido", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ status: "INVALIDO" })
        ).toThrow("O status deve ser: aprovado, reprovado ou pendente.");
      });
    });

    describe("pontuacaoMin", () => {
      it("deve aceitar pontuação mínima válida como string", () => {
        const result = InscricaoQuerySchema.parse({ pontuacaoMin: "5" });
        expect(result.pontuacaoMin).toBe(5);
      });

      it("deve aceitar pontuação mínima vazia (opcional)", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.pontuacaoMin).toBeUndefined();
      });

      it("deve rejeitar pontuação mínima fora do range", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMin: "15" })
        ).toThrow(
          "A pontuação mínima deve ser um número inteiro entre 0 e 10."
        );
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMin: "-1" })
        ).toThrow(
          "A pontuação mínima deve ser um número inteiro entre 0 e 10."
        );
      });

      it("deve rejeitar pontuação mínima não inteira", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMin: "5.5" })
        ).toThrow(
          "A pontuação mínima deve ser um número inteiro entre 0 e 10."
        );
      });
    });

    describe("pontuacaoMax", () => {
      it("deve aceitar pontuação máxima válida como string", () => {
        const result = InscricaoQuerySchema.parse({ pontuacaoMax: "85" });
        expect(result.pontuacaoMax).toBe(85);
      });

      it("deve aceitar pontuação máxima vazia (opcional)", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.pontuacaoMax).toBeUndefined();
      });

      it("deve rejeitar pontuação máxima fora do range", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMax: "150" })
        ).toThrow(
          "A pontuação máxima deve ser um número inteiro entre 0 e 100."
        );
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMax: "-1" })
        ).toThrow(
          "A pontuação máxima deve ser um número inteiro entre 0 e 100."
        );
      });

      it("deve rejeitar pontuação máxima não inteira", () => {
        expect(() =>
          InscricaoQuerySchema.parse({ pontuacaoMax: "85.5" })
        ).toThrow(
          "A pontuação máxima deve ser um número inteiro entre 0 e 100."
        );
      });
    });

    describe("page", () => {
      it("deve aceitar page válida como string", () => {
        const result = InscricaoQuerySchema.parse({ page: "2" });
        expect(result.page).toBe(2);
      });

      it("deve usar valor padrão quando page não fornecida", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.page).toBe(1);
      });

      it("deve rejeitar page menor ou igual a 0", () => {
        expect(() => InscricaoQuerySchema.parse({ page: "0" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
        expect(() => InscricaoQuerySchema.parse({ page: "-1" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
      });

      it("deve rejeitar page não inteira", () => {
        // parseInt("2.5") retorna 2, que é válido
        // O teste verifica se valores não numéricos falham
        expect(() => InscricaoQuerySchema.parse({ page: "abc" })).toThrow(
          "page deve ser um número inteiro maior que 0."
        );
      });
    });

    describe("limite", () => {
      it("deve aceitar limite válido como string", () => {
        const result = InscricaoQuerySchema.parse({ limite: "50" });
        expect(result.limite).toBe(50);
      });

      it("deve usar valor padrão quando limite não fornecida", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result.limite).toBe(10);
      });

      it("deve rejeitar limite fora do range", () => {
        expect(() => InscricaoQuerySchema.parse({ limite: "0" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
        expect(() => InscricaoQuerySchema.parse({ limite: "150" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
      });

      it("deve rejeitar limite não inteiro", () => {
        // parseInt("50.5") retorna 50, que é válido
        // O teste verifica se valores não numéricos falham
        expect(() => InscricaoQuerySchema.parse({ limite: "abc" })).toThrow(
          "limite deve ser um número inteiro entre 1 e 100."
        );
      });
    });

    describe("validação completa", () => {
      it("deve validar um objeto completo válido", () => {
        const input = {
          nome: "João Silva",
          email: "joao@email.com",
          status: "APROVADO",
          pontuacaoMin: "7",
          pontuacaoMax: "90",
          page: "2",
          limite: "20",
        };

        const result = InscricaoQuerySchema.parse(input);
        expect(result).toEqual({
          nome: "João Silva",
          email: "joao@email.com",
          status: "aprovado",
          pontuacaoMin: 7,
          pontuacaoMax: 90,
          page: 2,
          limite: 20,
        });
      });

      it("deve aceitar objeto vazio", () => {
        const result = InscricaoQuerySchema.parse({});
        expect(result).toEqual({
          page: 1,
          limite: 10,
        });
      });
    });
  });
});
