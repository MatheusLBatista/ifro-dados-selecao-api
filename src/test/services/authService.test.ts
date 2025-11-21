import AuthService from "../../service/AuthService";
import UsuarioRepository from "../../repository/UsuarioRepository";
import TokenUtil from "../../utils/TokenUtil";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../../utils/helpers/CustomError";

jest.mock("../../repository/UsuarioRepository");
jest.mock("../../utils/TokenUtil");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<UsuarioRepository>;
  let mockTokenUtil: jest.Mocked<typeof TokenUtil>;

  beforeEach(() => {
    mockRepository = new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    mockTokenUtil = TokenUtil as jest.Mocked<typeof TokenUtil>;

    service = new AuthService({
      tokenUtil: mockTokenUtil,
    });

    (service as any).repository = mockRepository;

    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("deve usar TokenUtil injetado quando fornecido", () => {
      const customTokenUtil = { generateAccessToken: jest.fn() };
      const serviceWithCustom = new AuthService({
        tokenUtil: customTokenUtil as any,
      });

      expect((serviceWithCustom as any).TokenUtil).toBe(customTokenUtil);
    });

    it("deve usar TokenUtil padrão quando não fornecido", () => {
      const serviceDefault = new AuthService();
      expect((serviceDefault as any).TokenUtil).toBe(TokenUtil);
    });
  });

  describe("loadTokens", () => {
    it("deve carregar tokens com sucesso", async () => {
      const mockUser = { _id: "user123", nome: "João" };
      mockRepository.findById.mockResolvedValue(mockUser as any);

      const result = await service.loadTokens("user123", "token123");

      expect(mockRepository.findById).toHaveBeenCalledWith("user123", true);
      expect(result).toEqual({ data: mockUser });
    });
  });

  describe("login", () => {
    const mockUser = {
      _id: "user123",
      email: "joao@teste.com",
      senha: "hashedPassword",
      toObject: () => ({
        _id: "user123",
        email: "joao@teste.com",
        nome: "João Silva",
        papel: "administrador",
      }),
    };

    beforeEach(() => {
      mockRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockTokenUtil.generateAccessToken.mockResolvedValue("accessToken123");
      mockTokenUtil.generateRefreshToken.mockResolvedValue("refreshToken123");
      mockRepository.findById.mockResolvedValue({
        ...mockUser,
        refreshtoken: null,
      } as any);
      mockRepository.saveTokens.mockResolvedValue({
        _id: "user123",
        accesstoken: "accessToken123",
        refreshtoken: "refreshToken123",
      } as any);
    });

    it("deve fazer login com sucesso quando não há refresh token", async () => {
      const loginData = { email: "joao@teste.com", senha: "senha123" };

      const result = await service.login(loginData);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "hashedPassword");
      expect(mockTokenUtil.generateAccessToken).toHaveBeenCalledWith("user123");
      expect(mockTokenUtil.generateRefreshToken).toHaveBeenCalledWith(
        "user123"
      );
      expect(mockRepository.saveTokens).toHaveBeenCalledWith(
        "user123",
        "accessToken123",
        "refreshToken123"
      );
      expect(result.user).toHaveProperty("accessToken", "accessToken123");
      expect(result.user).toHaveProperty("refreshtoken", "refreshToken123");
    });

    it("deve fazer login com sucesso quando há refresh token válido", async () => {
      mockRepository.findById.mockResolvedValue({
        ...mockUser,
        refreshtoken: "validRefreshToken",
      } as any);
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });

      const loginData = { email: "joao@teste.com", senha: "senha123" };

      const result = await service.login(loginData);

      expect(mockRepository.saveTokens).toHaveBeenCalledWith(
        "user123",
        "accessToken123",
        "validRefreshToken"
      );
      expect(result.user).toHaveProperty("refreshtoken", "validRefreshToken");
    });

    it("deve gerar novo refresh token quando o atual está expirado", async () => {
      mockRepository.findById.mockResolvedValue({
        ...mockUser,
        refreshtoken: "expiredToken",
      } as any);
      const error = new Error("TokenExpiredError");
      error.name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const loginData = { email: "joao@teste.com", senha: "senha123" };

      await service.login(loginData);

      expect(mockTokenUtil.generateRefreshToken).toHaveBeenCalledWith(
        "user123"
      );
      expect(mockRepository.saveTokens).toHaveBeenCalledWith(
        "user123",
        "accessToken123",
        "refreshToken123"
      );
    });

    it("deve gerar novo refresh token quando o atual é inválido", async () => {
      mockRepository.findById.mockResolvedValue({
        ...mockUser,
        refreshtoken: "invalidToken",
      } as any);
      const error = new Error("JsonWebTokenError");
      error.name = "JsonWebTokenError";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const loginData = { email: "joao@teste.com", senha: "senha123" };

      await service.login(loginData);

      expect(mockTokenUtil.generateRefreshToken).toHaveBeenCalledWith(
        "user123"
      );
      expect(mockRepository.saveTokens).toHaveBeenCalledWith(
        "user123",
        "accessToken123",
        "refreshToken123"
      );
    });

    it("deve lançar erro quando há outro tipo de erro na verificação do token", async () => {
      mockRepository.findById.mockResolvedValue({
        ...mockUser,
        refreshtoken: "token",
      } as any);
      const error = new Error("SomeOtherError");
      error.name = "SomeOtherError";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const loginData = { email: "joao@teste.com", senha: "senha123" };

      await expect(service.login(loginData)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro quando email não existe", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      const loginData = { email: "naoexiste@teste.com", senha: "senha123" };

      await expect(service.login(loginData)).rejects.toThrow(CustomError);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando senha é inválida", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const loginData = { email: "joao@teste.com", senha: "senhaErrada" };

      await expect(service.login(loginData)).rejects.toThrow(CustomError);
    });
  });

  describe("logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const mockUser = { _id: "user123", nome: "João" };
      mockRepository.removerTokens.mockResolvedValue(mockUser as any);

      const result = await service.logout("user123");

      expect(mockRepository.removerTokens).toHaveBeenCalledWith("user123");
      expect(result).toEqual({ data: mockUser });
    });
  });
});
