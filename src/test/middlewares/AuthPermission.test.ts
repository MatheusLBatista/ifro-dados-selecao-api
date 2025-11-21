// Mock do UsuarioRepository
jest.mock("../../repository/UsuarioRepository");
import UsuarioRepository from "../../repository/UsuarioRepository";

// Criar uma instância mockada
const mockRepositoryInstance = {
  findById: jest.fn(),
};

// Mock da classe para retornar a instância mockada
(
  UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>
).mockImplementation(() => mockRepositoryInstance as any);

// Sobrescrever o método no prototype para garantir que funcione
UsuarioRepository.prototype.findById = mockRepositoryInstance.findById;

import AuthPermission from "../../middlewares/AuthPermission";
import jwt from "jsonwebtoken";
import { CustomError } from "../../utils/helpers";

// Mock do jwt
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("AuthPermission", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
      baseUrl: "",
      route: { path: "" },
      method: "GET",
    };
    mockRes = {};
    mockNext = jest.fn();

    // Reset mocks
    mockRepositoryInstance.findById.mockReset();

    // Mock do JWT
    (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });

    // Mock das variáveis de ambiente
    process.env.JWT_SECRET_ACCESS_TOKEN = "test-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validação do header Authorization", () => {
    it("deve rejeitar quando não há header Authorization", async () => {
      mockReq.headers = {};

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando o header não começa com Bearer", async () => {
      mockReq.headers.authorization = "Basic token123";

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validação do token JWT", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
    });

    it("deve rejeitar quando JWT_SECRET_ACCESS_TOKEN não está configurado", async () => {
      delete process.env.JWT_SECRET_ACCESS_TOKEN;

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando jwt.verify falha", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validação do usuário no banco", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    });

    it("deve rejeitar quando usuário não é encontrado", async () => {
      mockRepositoryInstance.findById.mockRejectedValue(
        new Error("User not found")
      );

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve chamar findById com o ID correto", async () => {
      const mockUser = { _id: "user123", papel: "ADMINISTRADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/usuario";
      mockReq.route.path = "/";
      mockReq.method = "GET";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockRepositoryInstance.findById).toHaveBeenCalledWith("user123");
    });
  });

  describe("validação de permissões por rota", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    });

    it("deve permitir acesso quando não há regras definidas para a rota", async () => {
      const mockUser = { _id: "user123", papel: "avaliador" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/rota-sem-regras";
      mockReq.route.path = "/";
      mockReq.method = "GET";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "avaliador" });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("deve permitir acesso quando o papel tem permissão", async () => {
      const mockUser = { _id: "user123", papel: "ADMINISTRADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/usuario";
      mockReq.route.path = "/";
      mockReq.method = "GET";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "administrador" });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("deve rejeitar acesso quando o papel não tem permissão", async () => {
      const mockUser = { _id: "user123", papel: "AVALIADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/usuario";
      mockReq.route.path = "/";
      mockReq.method = "POST";

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve permitir acesso para rotas com parâmetros", async () => {
      const mockUser = { _id: "user123", papel: "COORDENADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/inscricao";
      mockReq.route.path = "/:id";
      mockReq.method = "GET";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "coordenador" });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("deve rejeitar acesso para rotas com parâmetros quando papel não tem permissão", async () => {
      const mockUser = { _id: "user123", papel: "AVALIADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/usuario";
      mockReq.route.path = "/:id";
      mockReq.method = "DELETE";

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("tratamento de erros JWT", () => {
    it("deve converter TokenExpiredError em CustomError", async () => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error("Token expired");
        error.name = "TokenExpiredError";
        throw error;
      });

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve converter JsonWebTokenError em CustomError", async () => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error("Invalid token");
        error.name = "JsonWebTokenError";
        throw error;
      });

      await expect(AuthPermission(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("regras específicas de rotas", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    });

    it("deve permitir administrador criar usuários", async () => {
      const mockUser = { _id: "user123", papel: "ADMINISTRADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/usuario";
      mockReq.route.path = "/";
      mockReq.method = "POST";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "administrador" });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("deve permitir avaliador avaliar inscrições", async () => {
      const mockUser = { _id: "user123", papel: "AVALIADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/inscricao";
      mockReq.route.path = "/:id/avaliar";
      mockReq.method = "PATCH";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "avaliador" });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("deve permitir coordenador aprovar inscrições", async () => {
      const mockUser = { _id: "user123", papel: "COORDENADOR" };
      mockRepositoryInstance.findById.mockResolvedValue(mockUser as any);

      mockReq.baseUrl = "/inscricao";
      mockReq.route.path = "/:id/aprovar";
      mockReq.method = "PATCH";

      await AuthPermission(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: "user123", papel: "coordenador" });
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
