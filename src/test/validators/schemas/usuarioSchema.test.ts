import {
  UsuarioSchema,
  UsuarioUpdateSchema,
} from "../../../utils/validators/schemas/UsuarioSchema";
import { Role } from "../../../models/Usuario";

describe("UsuarioSchema", () => {
  describe("validação de dados válidos", () => {
    it("deve validar usuário completo com sucesso", () => {
      const validData = {
        nome: "João Silva",
        email: "joao.silva@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "Senha123!",
        papel: "administrador",
      };

      const result = UsuarioSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nome).toBe("João Silva");
        expect(result.data.email).toBe("joao.silva@email.com");
        expect(result.data.telefone).toBe("11987654321");
        expect(result.data.data_nascimento).toBeInstanceOf(Date);
        expect(result.data.senha).toBe("Senha123!");
        expect(result.data.papel).toBe(Role.ADMIN);
      }
    });

    it("deve validar usuário sem senha (opcional)", () => {
      const dataWithoutPassword = {
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "11987654321",
        data_nascimento: "20/03/1995",
        papel: "coordenador",
      };

      const result = UsuarioSchema.safeParse(dataWithoutPassword);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.senha).toBeUndefined();
        expect(result.data.papel).toBe(Role.COORDENADOR);
      }
    });

    it("deve aceitar diferentes formatos de data", () => {
      const testCases = [
        { data: "15/05/1990", expected: true },
        { data: "15-05-1990", expected: true },
        { data: "15.05.1990", expected: true },
      ];

      testCases.forEach(({ data, expected }) => {
        const result = UsuarioSchema.safeParse({
          nome: "Teste",
          email: "teste@email.com",
          telefone: "11987654321",
          data_nascimento: data,
          papel: "avaliador",
        });

        expect(result.success).toBe(expected);
      });
    });

    it("deve converter papel para minúsculo", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "ADMINISTRADOR",
      };

      const result = UsuarioSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.papel).toBe(Role.ADMIN);
      }
    });
  });

  describe("validação de campos obrigatórios", () => {
    it("deve rejeitar quando nome está vazio", () => {
      const data = {
        nome: "",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando email é inválido", () => {
      const data = {
        nome: "Teste",
        email: "email-invalido",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result.error as any).issues[0].message).toBe(
          "Formato de email inválido."
        );
      }
    });

    it("deve rejeitar quando telefone não tem 11 dígitos", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "1198765432", // 10 dígitos
        data_nascimento: "15/05/1990",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result.error as any).issues[0].message).toBe(
          "O celular deve conter 11 dígitos numéricos."
        );
      }
    });

    it("deve rejeitar quando nome está vazio", () => {
      const data = {
        nome: "",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result.error as any).issues[0].message).toBe(
          "Campo nome é obrigatório."
        );
      }
    });

    it("deve rejeitar quando data de nascimento está no futuro", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: futureDate
          .toLocaleDateString("pt-BR")
          .replace(/\//g, "/"),
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result.error as any).issues[0].message).toBe(
          "Data de nascimento não pode ser no futuro."
        );
      }
    });

    it("deve rejeitar quando idade é menor que 16 anos", () => {
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 15); 
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: youngDate
          .toLocaleDateString("pt-BR")
          .replace(/\//g, "/"),
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result.error as any).issues[0].message).toBe(
          "Você deve ter pelo menos 16 anos."
        );
      }
    });

    it("deve rejeitar quando papel não é fornecido", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        // papel não fornecido
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("validação de senha", () => {
    it("deve aceitar senha válida quando fornecida", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "Senha123!",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar senha com menos de 8 caracteres", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "1234567",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem letra maiúscula", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "senha123!",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem letra minúscula", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "SENHA123!",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem número", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "SenhaAbc!",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem caractere especial", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "Senha123",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve aceitar senha exatamente com 8 caracteres", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        senha: "Abc123!@",
        papel: "avaliador",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("validação de papel", () => {
    it("deve aceitar todos os valores válidos de papel", () => {
      const validRoles = Object.values(Role);

      validRoles.forEach((role) => {
        const data = {
          nome: "Teste",
          email: "teste@email.com",
          telefone: "11987654321",
          data_nascimento: "15/05/1990",
          papel: role,
        };

        const result = UsuarioSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("deve aceitar papel em maiúsculo", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "ADMINISTRADOR",
      };

      const result = UsuarioSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.papel).toBe(Role.ADMIN);
      }
    });

    it("deve aceitar papel em minúsculo", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "coordenador",
      };

      const result = UsuarioSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.papel).toBe(Role.COORDENADOR);
      }
    });

    it("deve aceitar papel com primeira letra maiúscula", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "Avaliador",
      };

      const result = UsuarioSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.papel).toBe(Role.AVALIADOR);
      }
    });

    it("deve rejeitar papel inválido", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "gerente",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar papel vazio", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        papel: "",
      };

      const result = UsuarioSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("UsuarioUpdateSchema", () => {
    it("deve aceitar objeto parcialmente preenchido", () => {
      const partialData = {
        nome: "Novo Nome",
      };

      const result = UsuarioUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("deve validar campos fornecidos mesmo sendo parcial", () => {
      const partialData = {
        email: "email-invalido",
      };

      const result = UsuarioUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(false);
    });

    it("deve aceitar atualização apenas do papel", () => {
      const partialData = {
        papel: "coordenador",
      };

      const result = UsuarioUpdateSchema.safeParse(partialData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.papel).toBe(Role.COORDENADOR);
      }
    });

    it("deve aceitar atualização apenas da senha", () => {
      const partialData = {
        senha: "NovaSenha123!",
      };

      const result = UsuarioUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });
  });
});
