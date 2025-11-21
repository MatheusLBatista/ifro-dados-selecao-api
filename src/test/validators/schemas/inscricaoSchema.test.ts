import {
  InscricaoSchema,
  InscricaoUpdateSchema,
} from "../../../utils/validators/schemas/InscricaoSchema";
import { Status } from "../../../models/Inscricao";

describe("InscricaoSchema", () => {
  describe("validação de dados válidos", () => {
    it("deve validar inscrição completa com sucesso", () => {
      const validData = {
        nome: "João Silva",
        email: "joao.silva@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          {
            certificado: "https://certificado.com/cert1",
            descricao: "Certificado de conclusão de curso de programação",
          },
        ],
        experiencia: "Tenho 5 anos de experiência em desenvolvimento web",
        area_interesse: "Desenvolvimento Full Stack",
        observacao: "Observação opcional",
        pontuacao: 8.5,
        status: "PENDENTE",
      };

      const result = InscricaoSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nome).toBe("João Silva");
        expect(result.data.email).toBe("joao.silva@email.com");
        expect(result.data.telefone).toBe("11987654321");
        expect(result.data.data_nascimento).toBeInstanceOf(Date);
        expect(result.data.background).toHaveLength(1);
        expect(result.data.pontuacao).toBe(8.5);
        expect(result.data.status).toBe(Status.PENDENTE);
      }
    });

    it("deve validar inscrição sem campos opcionais", () => {
      const minimalData = {
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "11987654321",
        data_nascimento: "20/03/1995",
        background: [
          {
            certificado: "https://certificado.com/cert1",
            descricao: "Certificado de conclusão de curso",
          },
        ],
        experiencia: "Experiência em desenvolvimento de software",
        area_interesse: "Frontend",
      };

      const result = InscricaoSchema.safeParse(minimalData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.observacao).toBeUndefined();
        expect(result.data.pontuacao).toBeUndefined();
        expect(result.data.status).toBe(Status.PENDENTE);
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
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando email é inválido", () => {
      const data = {
        nome: "Teste",
        email: "email-invalido",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando telefone não tem 11 dígitos", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "1198765432", // 10 dígitos
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando telefone contém letras", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "1198765432a",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
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
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando idade é menor que 16 anos", () => {
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 15); // 15 anos atrás
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: youngDate
          .toLocaleDateString("pt-BR")
          .replace(/\//g, "/"),
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando background está vazio", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [],
        experiencia: "Experiência",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando experiência tem menos de 20 caracteres", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Curta",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando área de interesse é muito curta", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência com pelo menos 20 caracteres",
        area_interesse: "A",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("validação de background", () => {
    it("deve rejeitar quando certificado é muito curto", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [{ certificado: "abc", descricao: "Descrição válida" }],
        experiencia: "Experiência válida com pelo menos 20 caracteres",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando descrição do certificado é muito curta", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://certificado.com", descricao: "Curta" },
        ],
        experiencia: "Experiência válida com pelo menos 20 caracteres",
        area_interesse: "Área",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("validação de pontuação", () => {
    it("deve rejeitar quando pontuação é maior que 10", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
        pontuacao: 15,
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar quando pontuação é negativa", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
        pontuacao: -1,
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("validação de status", () => {

    it("deve rejeitar status inválido", () => {
      const data = {
        nome: "Teste",
        email: "teste@email.com",
        telefone: "11987654321",
        data_nascimento: "15/05/1990",
        background: [
          { certificado: "https://cert.com", descricao: "Certificado" },
        ],
        experiencia: "Experiência",
        area_interesse: "Área",
        status: "INVALIDO",
      };

      const result = InscricaoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("InscricaoUpdateSchema", () => {
    it("deve aceitar objeto parcialmente preenchido", () => {
      const partialData = {
        nome: "Novo Nome",
      };

      const result = InscricaoUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("deve validar campos fornecidos mesmo sendo parcial", () => {
      const partialData = {
        email: "email-invalido",
      };

      const result = InscricaoUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(false);
    });
  });
});
