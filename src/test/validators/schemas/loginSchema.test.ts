import { LoginSchema } from "../../../utils/validators/schemas/LoginSchema";

describe("LoginSchema", () => {
  describe("validação de dados válidos", () => {
    it("deve validar login com email e senha válidos", () => {
      const validData = {
        email: "usuario@email.com",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("usuario@email.com");
        expect(result.data.senha).toBe("Senha123!");
      }
    });

    it("deve aceitar email com subdomínio", () => {
      const data = {
        email: "usuario@sub.dominio.com",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve aceitar senha com caracteres especiais válidos", () => {
      const validPasswords = [
        "Senha123!",
        "Teste456@",
        "Abc123$%",
        "Minha789&*",
      ];

      validPasswords.forEach((password) => {
        const data = {
          email: "usuario@email.com",
          senha: password,
        };

        const result = LoginSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("validação de email", () => {
    it("deve rejeitar email vazio", () => {
      const data = {
        email: "",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar email sem @", () => {
      const data = {
        email: "usuarioemail.com",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar email sem domínio", () => {
      const data = {
        email: "usuario@",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar email com espaços", () => {
      const data = {
        email: "usuario @email.com",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar email com caracteres especiais inválidos", () => {
      const invalidEmails = [
        "usuario@.com",
        "usuario..email@dominio.com",
        "usuario@dominio.",
        "@dominio.com",
      ];

      invalidEmails.forEach((email) => {
        const data = {
          email,
          senha: "Senha123!",
        };

        const result = LoginSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe("validação de senha", () => {
    it("deve rejeitar senha com menos de 8 caracteres", () => {
      const data = {
        email: "usuario@email.com",
        senha: "1234567",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem letra maiúscula", () => {
      const data = {
        email: "usuario@email.com",
        senha: "senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem letra minúscula", () => {
      const data = {
        email: "usuario@email.com",
        senha: "SENHA123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha vazia", () => {
      const data = {
        email: "usuario@email.com",
        senha: "",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando senha não é fornecida", () => {
      const data = {
        email: "usuario@email.com",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve aceitar senha sem caractere especial", () => {
      const data = {
        email: "usuario@email.com",
        senha: "Senha123",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve aceitar senha exatamente com 8 caracteres", () => {
      const data = {
        email: "usuario@email.com",
        senha: "Abc123!@",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve aceitar senha com mais de 8 caracteres", () => {
      const data = {
        email: "usuario@email.com",
        senha: "MinhaSenhaSuperSegura123!@",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve aceitar diferentes caracteres especiais", () => {
      const specialChars = ["!", "@", "$", "%", "&", "*"];

      specialChars.forEach((char) => {
        const data = {
          email: "usuario@email.com",
          senha: `Senha123${char}`,
        };

        const result = LoginSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("validação combinada", () => {
    it("deve rejeitar quando ambos email e senha são inválidos", () => {
      const data = {
        email: "email-invalido",
        senha: "123",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando apenas email é inválido", () => {
      const data = {
        email: "email-invalido",
        senha: "Senha123!",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando apenas senha é inválida", () => {
      const data = {
        email: "usuario@email.com",
        senha: "123",
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
