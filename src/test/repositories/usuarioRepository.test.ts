import UsuarioRepository from "../../repository/UsuarioRepository";
import Usuario from "../../models/Usuario";
import UsuarioFilterBuild from "../../repository/filters/UsuarioFilterBuild";
import { UsuarioDTO } from "../../utils/validators/schemas/UsuarioSchema";
import { CustomError } from "../../utils/helpers";
import { Role } from "../../models/Usuario";

jest.mock("../../models/Usuario");
jest.mock("../../repository/filters/UsuarioFilterBuild");

describe("UsuarioRepository", () => {
  let repository: UsuarioRepository;
  let mockUsuario: jest.Mocked<typeof Usuario>;
  let mockFilterBuilder: jest.Mocked<UsuarioFilterBuild>;

  beforeEach(() => {
    mockUsuario = Usuario as jest.Mocked<typeof Usuario>;
    mockFilterBuilder =
      new UsuarioFilterBuild() as jest.Mocked<UsuarioFilterBuild>;
    (
      UsuarioFilterBuild as jest.MockedClass<typeof UsuarioFilterBuild>
    ).mockImplementation(() => mockFilterBuilder);
    repository = new UsuarioRepository();
    jest.clearAllMocks();
  });

  describe("saveTokens", () => {
    it("deve salvar tokens com sucesso", async () => {
      const id = "123";
      const accesstoken = "access123";
      const refreshtoken = "refresh123";
      const mockDocument = {
        _id: "123",
        save: jest
          .fn()
          .mockResolvedValue({ _id: "123", accesstoken, refreshtoken }),
      };

      mockUsuario.findById.mockResolvedValue(mockDocument as any);

      const result = await repository.saveTokens(id, accesstoken, refreshtoken);

      expect(mockUsuario.findById).toHaveBeenCalledWith("123");
      expect(mockDocument.save).toHaveBeenCalled();
      expect(result).toEqual({ _id: "123", accesstoken, refreshtoken });
    });

    it("deve lançar erro quando usuário não encontrado", async () => {
      const id = "123";

      mockUsuario.findById.mockResolvedValue(null);

      await expect(
        repository.saveTokens(id, "access", "refresh")
      ).rejects.toThrow(CustomError);
      expect(mockUsuario.findById).toHaveBeenCalledWith("123");
    });
  });

  describe("removerTokens", () => {
    it("deve remover tokens com sucesso", async () => {
      const id = "123";
      const mockUsuarioDoc = {
        _id: "123",
        refreshtoken: null,
        accesstoken: null,
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUsuarioDoc),
      };
      mockUsuario.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      const result = await repository.removerTokens(id);

      expect(mockUsuario.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { refreshtoken: null, accesstoken: null },
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBe(mockUsuarioDoc);
    });

    it("deve lançar erro quando usuário não encontrado", async () => {
      const id = "123";

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };
      mockUsuario.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      await expect(repository.removerTokens(id)).rejects.toThrow(CustomError);
      expect(mockUsuario.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { refreshtoken: null, accesstoken: null },
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });

  describe("read", () => {
    it("deve retornar usuários com filtros", async () => {
      const req = {
        query: {
          nome: "João",
          email: "joao@teste.com",
          papel: "administrador",
          page: "1",
          limite: "10",
        },
      } as any;
      const mockData = {
        docs: [{ nome: "João" }],
        totalDocs: 1,
        totalPages: 1,
      };
      const expectedFilters = {
        nome: { $regex: "João", $options: "i" },
        email: { $regex: "joao@teste.com", $options: "i" },
        papel: { $regex: "administrador", $options: "i" },
      };

      mockFilterBuilder.comNome.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comEmail.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comPapel.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.build.mockReturnValue(expectedFilters);

      const mockPaginate = jest.fn().mockResolvedValue(mockData);
      (mockUsuario as any).paginate = mockPaginate;

      const result = await repository.read(req);

      expect(mockFilterBuilder.comNome).toHaveBeenCalledWith("João");
      expect(mockFilterBuilder.comEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(mockFilterBuilder.comPapel).toHaveBeenCalledWith("administrador");
      expect(mockFilterBuilder.build).toHaveBeenCalled();
      expect(mockPaginate).toHaveBeenCalledWith(expectedFilters, {
        page: 1,
        limit: 10,
        sort: { createdAt: -1 },
        lean: true,
      });
      expect(result).toBe(mockData);
    });

    it("deve usar valores padrão para paginação", async () => {
      const req = { query: {} } as any;
      const mockData = { docs: [], totalDocs: 0, totalPages: 0 };
      const expectedFilters = {};

      mockFilterBuilder.build.mockReturnValue(expectedFilters);

      const mockPaginate = jest.fn().mockResolvedValue(mockData);
      (mockUsuario as any).paginate = mockPaginate;

      const result = await repository.read(req);

      expect(mockFilterBuilder.build).toHaveBeenCalled();
      expect(mockPaginate).toHaveBeenCalledWith(expectedFilters, {
        page: 1,
        limit: 10,
        sort: { createdAt: -1 },
        lean: true,
      });
      expect(result).toBe(mockData);
    });
  });

  describe("create", () => {
    it("deve criar usuário com sucesso", async () => {
      const parsedData: UsuarioDTO = {
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        papel: Role.ADMIN,
        senha: "senha123",
      };
      const mockCreated = {
        ...parsedData,
        _id: "123",
        save: jest.fn().mockResolvedValue({ ...parsedData, _id: "123" }),
      };

      mockUsuario.create.mockResolvedValue(mockCreated as any);

      const result = await repository.create(parsedData);

      expect(mockUsuario.create).toHaveBeenCalledWith(parsedData);
      expect(mockCreated.save).toHaveBeenCalled();
      expect(result).toEqual({ ...parsedData, _id: "123" });
    });
  });

  describe("delete", () => {
    it("deve deletar usuário com sucesso", async () => {
      const id = "123";
      const mockDeleted = { _id: "123", nome: "João" };

      mockUsuario.findByIdAndDelete.mockResolvedValue(mockDeleted as any);

      const result = await repository.delete(id);

      expect(mockUsuario.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toBe(mockDeleted);
    });
  });

  describe("findByEmail", () => {
    it("deve encontrar usuário por email", async () => {
      const email = "joao@teste.com";
      const mockUser = { email, senha: "hashed" };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUser),
      };
      mockUsuario.findOne.mockReturnValue(mockQuery as any);

      const result = await repository.findByEmail(email);

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).toHaveBeenCalledWith("+senha");
      expect(result).toBe(mockUser);
    });

    it("deve retornar null quando email não encontrado", async () => {
      const email = "naoexiste@teste.com";

      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };
      mockUsuario.findOne.mockReturnValue(mockQuery as any);

      const result = await repository.findByEmail(email);

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).toHaveBeenCalledWith("+senha");
      expect(result).toBeNull();
    });
  });

  describe("findByNome", () => {
    it("deve encontrar usuário por nome", async () => {
      const nome = "João Silva";
      const mockUser = { nome };

      mockUsuario.findOne.mockResolvedValue(mockUser as any);

      const result = await repository.findByNome(nome);

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ nome });
      expect(result).toBe(mockUser);
    });

    it("deve retornar null quando nome não encontrado", async () => {
      const nome = "Nome Inexistente";

      mockUsuario.findOne.mockResolvedValue(null);

      const result = await repository.findByNome(nome);

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ nome });
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("deve encontrar usuário por ID sem tokens", async () => {
      const id = "123";
      const mockUser = { _id: "123", nome: "João" };

      mockUsuario.findById.mockResolvedValue(mockUser as any);

      const result = await repository.findById(id);

      expect(mockUsuario.findById).toHaveBeenCalledWith("123");
      expect(result).toBe(mockUser);
    });

    it("deve encontrar usuário por ID com tokens", async () => {
      const id = "123";
      const mockUser = {
        _id: "123",
        nome: "João",
        refreshtoken: "token",
        accesstoken: "access",
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUser),
      };
      mockUsuario.findById.mockReturnValue(mockQuery as any);

      const result = await repository.findById(id, true);

      expect(mockUsuario.findById).toHaveBeenCalledWith("123");
      expect(mockQuery.select).toHaveBeenCalledWith(
        "+refreshtoken +accesstoken"
      );
      expect(result).toBe(mockUser);
    });

    it("deve lançar erro quando usuário não encontrado", async () => {
      const id = "123";

      mockUsuario.findById.mockResolvedValue(null);

      await expect(repository.findById(id)).rejects.toThrow(CustomError);
      expect(mockUsuario.findById).toHaveBeenCalledWith("123");
    });
  });
});
