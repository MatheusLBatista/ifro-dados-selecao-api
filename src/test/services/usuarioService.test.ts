import UsuarioService from "../../service/UsuarioService";
import UsuarioRepository from "../../repository/UsuarioRepository";
import AuthHelper from "../../utils/AuthHelper";
import { UsuarioDTO } from "../../utils/validators/schemas/UsuarioSchema";
import CustomError from "../../utils/helpers/CustomError";
import { Role } from "../../models/Usuario";

jest.mock("../../repository/UsuarioRepository");
jest.mock("../../utils/AuthHelper");

describe("UsuarioService", () => {
  let service: UsuarioService;
  let mockRepository: jest.Mocked<UsuarioRepository>;
  let mockAuthHelper: jest.Mocked<typeof AuthHelper>;

  beforeEach(() => {
    mockRepository = new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    mockAuthHelper = AuthHelper as jest.Mocked<typeof AuthHelper>;
    service = new UsuarioService();
    (service as any).repository = mockRepository;
    jest.clearAllMocks();
  });

  describe("read", () => {
    it("deve retornar dados do usuário", async () => {
      const mockData = [{ nome: "João", email: "joao@teste.com" }];
      const req = { params: {}, query: {} } as any;

      mockRepository.read.mockResolvedValue(mockData as any);

      const result = await service.read(req);

      expect(mockRepository.read).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });

    it("deve retornar usuário específico quando ID é fornecido", async () => {
      const mockUser = {
        _id: "123",
        nome: "João",
        email: "joao@teste.com",
      };
      const req = { params: { id: "123" }, query: {} } as any;

      mockRepository.findById.mockResolvedValue(mockUser as any);

      const result = await service.read(req);

      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(result).toBe(mockUser);
    });

    it("deve validar query parameters quando fornecidos", async () => {
      const mockData = [{ nome: "João", email: "joao@teste.com" }];
      const req = {
        params: {},
        query: { nome: "João", page: "1" },
      } as any;

      mockRepository.read.mockResolvedValue(mockData as any);

      const result = await service.read(req);

      expect(mockRepository.read).toHaveBeenCalledWith(req);
      expect(result).toBe(mockData);
    });
  });

  describe("create", () => {
    const mockData: UsuarioDTO = {
      nome: "João Silva",
      email: "joao@teste.com",
      telefone: "68999999999",
      data_nascimento: new Date("1990-01-01"),
      papel: Role.ADMIN,
      senha: "senha123",
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
        papel: Role.ADMIN,
        senha: "hashedPassword",
      } as any);
      mockAuthHelper.hashPassword.mockResolvedValue({
        senha: "hashedPassword",
      });
    });

    it("deve criar usuário com sucesso com senha", async () => {
      const result = await service.create(mockData);

      expect(mockAuthHelper.hashPassword).toHaveBeenCalledWith("senha123");
      expect(mockRepository.findByEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(mockRepository.findByNome).toHaveBeenCalledWith("João Silva");
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockData,
        senha: "hashedPassword",
      });
      expect(result).toEqual({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        papel: Role.ADMIN,
        senha: "hashedPassword",
      });
    });

    it("deve criar usuário sem senha", async () => {
      const dataWithoutPassword = { ...mockData, senha: undefined };
      mockRepository.create.mockResolvedValue({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        papel: Role.ADMIN,
      } as any);

      const result = await service.create(dataWithoutPassword);

      expect(mockAuthHelper.hashPassword).not.toHaveBeenCalled();
      expect(mockRepository.findByEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(mockRepository.findByNome).toHaveBeenCalledWith("João Silva");
      expect(mockRepository.create).toHaveBeenCalledWith(dataWithoutPassword);
      expect(result).toEqual({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        papel: Role.ADMIN,
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

  describe("deletar", () => {
    it("deve deletar usuário com sucesso", async () => {
      const id = "123";
      const req = {} as any;
      const mockUser = { _id: "123", nome: "João" };
      const mockResult = { deletedCount: 1 };

      mockRepository.findById.mockResolvedValue(mockUser as any);
      mockRepository.delete.mockResolvedValue(mockResult as any);

      const result = await service.deletar(id, req);

      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(mockRepository.delete).toHaveBeenCalledWith("123");
      expect(result).toBe(mockResult);
    });

    it("deve lançar erro quando usuário não encontrado", async () => {
      const id = "123";
      const req = {} as any;

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deletar(id, req)).rejects.toThrow(CustomError);
      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(mockRepository.delete).not.toHaveBeenCalled();
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
