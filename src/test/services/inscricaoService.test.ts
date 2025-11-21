import InscricaoService from "../../service/InscricaoService";
import InscricaoRepository from "../../repository/InscricaoRepository";
import { InscricaoQuerySchema } from "../../utils/validators/schemas/queries/InscricaoQuerySchema";
import CustomError from "../../utils/helpers/CustomError";

jest.mock("../../repository/InscricaoRepository");
jest.mock("../../utils/validators/schemas/queries/InscricaoQuerySchema");

describe("InscricaoService", () => {
  let service: InscricaoService;
  let mockRepository: jest.Mocked<InscricaoRepository>;

  beforeEach(() => {
    mockRepository =
      new InscricaoRepository() as jest.Mocked<InscricaoRepository>;
    service = new InscricaoService();
    (service as any).repository = mockRepository;
    jest.clearAllMocks();
  });

  describe("read", () => {
    it("deve retornar inscrição por ID quando fornecido", async () => {
      const mockInscricao = { _id: "123", nome: "João" };
      const req = { params: { id: "123" }, query: {} } as any;

      mockRepository.findById.mockResolvedValue(mockInscricao as any);

      const result = await service.read(req);

      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(result).toBe(mockInscricao);
    });

    it("deve validar query parameters quando fornecidos", async () => {
      const req = {
        params: {},
        query: { nome: "João", status: "aprovado" },
      } as any;
      const mockData = [{ nome: "João" }];

      mockRepository.read.mockResolvedValue(mockData as any);
      (InscricaoQuerySchema.parseAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await service.read(req);

      expect(InscricaoQuerySchema.parseAsync).toHaveBeenCalledWith({
        nome: "João",
        status: "aprovado",
      });
      expect(mockRepository.read).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });

    it("deve chamar read do repository quando não há ID nem query", async () => {
      const req = { params: {}, query: {} } as any;
      const mockData = [{ nome: "João" }];

      mockRepository.read.mockResolvedValue(mockData as any);

      const result = await service.read(req);

      expect(InscricaoQuerySchema.parseAsync).not.toHaveBeenCalled();
      expect(mockRepository.read).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });
  });

  describe("findEvaluated", () => {
    it("deve retornar inscrição avaliada por ID quando fornecido", async () => {
      const mockInscricao = { _id: "123", nome: "João", status: "avaliado" };
      const req = { params: { id: "123" }, query: {} } as any;

      mockRepository.findById.mockResolvedValue(mockInscricao as any);

      const result = await service.findEvaluated(req);

      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(result).toBe(mockInscricao);
    });

    it("deve validar query parameters quando fornecidos", async () => {
      const req = {
        params: {},
        query: { nome: "João", status: "aprovado" },
      } as any;
      const mockData = [{ nome: "João", status: "avaliado" }];

      mockRepository.findEvaluated.mockResolvedValue(mockData as any);
      (InscricaoQuerySchema.parseAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await service.findEvaluated(req);

      expect(InscricaoQuerySchema.parseAsync).toHaveBeenCalledWith({
        nome: "João",
        status: "aprovado",
      });
      expect(mockRepository.findEvaluated).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });

    it("deve chamar findEvaluated do repository quando não há ID nem query", async () => {
      const req = { params: {}, query: {} } as any;
      const mockData = [{ nome: "João", status: "avaliado" }];

      mockRepository.findEvaluated.mockResolvedValue(mockData as any);

      const result = await service.findEvaluated(req);

      expect(InscricaoQuerySchema.parseAsync).not.toHaveBeenCalled();
      expect(mockRepository.findEvaluated).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });
  });

  describe("create", () => {
    const mockData = {
      nome: "João Silva",
      email: "joao@teste.com",
      telefone: "68999999999",
      data_nascimento: new Date("1990-01-01"),
      background: [] as { certificado: string; descricao: string }[],
      experiencia: "2 anos",
      area_interesse: "tecnologia",
      pontuacao: 8,
      status: "PENDENTE" as any,
    };

    beforeEach(() => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByNome.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        background: [],
        experiencia: "2 anos",
        area_interesse: "tecnologia",
      } as any);
    });

    it("deve criar inscrição com sucesso", async () => {
      const result = await service.create(mockData);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(mockRepository.findByNome).toHaveBeenCalledWith("João Silva");
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockData,
        pontuacao: undefined,
        status: undefined,
      });
      expect(result).toEqual({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        background: [],
        experiencia: "2 anos",
        area_interesse: "tecnologia",
      });
    });

    it("deve lançar erro quando email já existe", async () => {
      mockRepository.findByEmail.mockResolvedValue({
        email: "joao@teste.com",
      } as any);

      await expect(service.create(mockData)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro quando nome já existe", async () => {
      mockRepository.findByNome.mockResolvedValue({
        nome: "João Silva",
      } as any);

      await expect(service.create(mockData)).rejects.toThrow(CustomError);
    });
  });

  describe("evaluate", () => {
    it("deve avaliar inscrição com sucesso", async () => {
      const id = "123";
      const parsedData = { pontuacao: 8, status: "avaliado" as any };
      const mockResult = { _id: "123", pontuacao: 8 };

      mockRepository.evaluate.mockResolvedValue(mockResult as any);

      const result = await service.evaluate(id, parsedData);

      expect(mockRepository.evaluate).toHaveBeenCalledWith("123", {
        pontuacao: 8,
      });
      expect(result).toBe(mockResult);
    });
  });

  describe("approve", () => {
    it("deve aprovar inscrição com sucesso", async () => {
      const id = "123";
      const parsedData = { status: "APROVADO" as any, pontuacao: 9 };
      const mockResult = { _id: "123", status: "APROVADO" };

      mockRepository.approve.mockResolvedValue(mockResult as any);

      const result = await service.approve(id, parsedData);

      expect(mockRepository.approve).toHaveBeenCalledWith("123", {
        status: "APROVADO",
      });
      expect(result).toBe(mockResult);
    });
  });

  describe("maintainPermittedFields", () => {
    it("deve manter apenas campos permitidos", () => {
      const obj = {
        nome: "João",
        email: "joao@teste.com",
        status: "PENDENTE",
        pontuacao: 8,
      };
      const permittedFields = ["status"];

      service.maintainPermittedFields(obj, permittedFields);

      expect(obj).toEqual({ status: "PENDENTE" });
    });

    it("deve manter múltiplos campos permitidos", () => {
      const obj = {
        nome: "João",
        email: "joao@teste.com",
        status: "PENDENTE",
        pontuacao: 8,
      };
      const permittedFields = ["nome", "email"];

      service.maintainPermittedFields(obj, permittedFields);

      expect(obj).toEqual({ nome: "João", email: "joao@teste.com" });
    });
  });

  describe("validateData", () => {
    it("deve passar validação quando nome e email não existem", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByNome.mockResolvedValue(null);

      await expect(
        service.validateData("João Silva", "joao@teste.com")
      ).resolves.not.toThrow();
    });

    it("deve lançar erro quando email já existe", async () => {
      mockRepository.findByEmail.mockResolvedValue({
        email: "joao@teste.com",
      } as any);

      await expect(
        service.validateData("João Silva", "joao@teste.com")
      ).rejects.toThrow(CustomError);
    });

    it("deve lançar erro quando nome já existe", async () => {
      mockRepository.findByNome.mockResolvedValue({
        nome: "João Silva",
      } as any);

      await expect(
        service.validateData("João Silva", "joao@teste.com")
      ).rejects.toThrow(CustomError);
    });
  });
});
