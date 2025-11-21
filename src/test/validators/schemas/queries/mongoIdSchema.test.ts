import { MongoIdSchema } from "../../../../utils/validators/schemas/queries/MongoIdSchema";

describe("MongoIdSchema", () => {
  describe("validação de ObjectId", () => {
    it("deve aceitar ObjectId válido", () => {
      const validId = "507f1f77bcf86cd799439011";
      const result = MongoIdSchema.parse(validId);
      expect(result).toBe(validId);
    });

    it("deve aceitar ObjectId válido com letras maiúsculas", () => {
      const validId = "507F1F77BCF86CD799439011";
      const result = MongoIdSchema.parse(validId);
      expect(result).toBe(validId);
    });

    it("deve aceitar ObjectId válido com números", () => {
      const validId = "123456789012345678901234";
      const result = MongoIdSchema.parse(validId);
      expect(result).toBe(validId);
    });

    it("deve rejeitar ObjectId com comprimento incorreto", () => {
      const invalidId = "507f1f77bcf86cd79943901"; // 23 caracteres
      expect(() => MongoIdSchema.parse(invalidId)).toThrow("ID inválido");

      const invalidId2 = "507f1f77bcf86cd7994390111"; // 25 caracteres
      expect(() => MongoIdSchema.parse(invalidId2)).toThrow("ID inválido");
    });

    it("deve rejeitar ObjectId com caracteres inválidos", () => {
      const invalidId = "507f1f77bcf86cd79943901g"; // contém 'g'
      expect(() => MongoIdSchema.parse(invalidId)).toThrow("ID inválido");
    });

    it("deve rejeitar string vazia", () => {
      expect(() => MongoIdSchema.parse("")).toThrow("ID inválido");
    });

    it("deve rejeitar string com espaços", () => {
      const invalidId = "507f1f77 bcf86cd799439011";
      expect(() => MongoIdSchema.parse(invalidId)).toThrow("ID inválido");
    });

    it("deve rejeitar string com caracteres especiais", () => {
      const invalidId = "507f1f77bcf86cd79943901@";
      expect(() => MongoIdSchema.parse(invalidId)).toThrow("ID inválido");
    });

    it("deve rejeitar valores não string", () => {
      expect(() => MongoIdSchema.parse(123)).toThrow();
      expect(() => MongoIdSchema.parse(null)).toThrow();
      expect(() => MongoIdSchema.parse(undefined)).toThrow();
      expect(() => MongoIdSchema.parse({})).toThrow();
    });

    describe("casos edge", () => {
      it("deve aceitar ObjectId com apenas números", () => {
        const validId = "000000000000000000000000";
        const result = MongoIdSchema.parse(validId);
        expect(result).toBe(validId);
      });

      it("deve aceitar ObjectId com apenas letras minúsculas", () => {
        const validId = "aaaaaaaaaaaaaaaaaaaaaaaa";
        const result = MongoIdSchema.parse(validId);
        expect(result).toBe(validId);
      });

      it("deve aceitar ObjectId com apenas letras maiúsculas", () => {
        const validId = "AAAAAAAAAAAAAAAAAAAAAAAA";
        const result = MongoIdSchema.parse(validId);
        expect(result).toBe(validId);
      });
    });
  });
});
