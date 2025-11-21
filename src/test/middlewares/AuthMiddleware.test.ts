import AuthMiddleware from "../../middlewares/AuthMiddleware";
import jwt from "jsonwebtoken";
import { CustomError } from "../../utils/helpers";

jest.mock("../../service/AuthService");
import AuthService from "../../service/AuthService";

const mockAuthService = {
  loadTokens: jest.fn(),
};

AuthService.prototype.loadTokens = mockAuthService.loadTokens;

describe("AuthMiddleware", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
    
    mockAuthService.loadTokens.mockReset();
    
    jest.spyOn(jwt, "verify").mockReturnValue({ id: "user123" } as any);
    
    process.env.JWT_SECRET_ACCESS_TOKEN = "test-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validação do header Authorization", () => {
    it("deve rejeitar quando não há header Authorization", async () => {
      mockReq.headers = {};

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando o header Authorization não começa com Bearer", async () => {
      mockReq.headers.authorization = "Basic token123";

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando não há token após Bearer", async () => {
      mockReq.headers.authorization = "Bearer ";

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando não há espaço após Bearer", async () => {
      mockReq.headers.authorization = "Bearertoken123";

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validação do token JWT", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
    });

    it("deve rejeitar quando jwt.verify falha", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando jwt.verify retorna null", async () => {
      (jwt.verify as jest.Mock).mockReturnValue(null);

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validação dos tokens no serviço", () => {
    beforeEach(() => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    });

    it("deve rejeitar quando loadTokens retorna null", async () => {
      mockAuthService.loadTokens.mockResolvedValue({ data: null });

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando loadTokens retorna dados sem refreshtoken", async () => {
      mockAuthService.loadTokens.mockResolvedValue({
        data: { accesstoken: "token", refreshtoken: null },
      });

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando loadTokens lança erro", async () => {
      mockAuthService.loadTokens.mockRejectedValue(new Error("Database error"));

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("tratamento de erros gerais", () => {
    it("deve converter qualquer erro em CustomError", async () => {
      mockReq.headers.authorization = "Bearer validtoken123";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await expect(AuthMiddleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        CustomError
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
