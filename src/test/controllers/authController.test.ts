import AuthController from "../../controller/AuthController";
import AuthService from "../../service/AuthService";
import CustomError from "../../utils/helpers/CustomError";
import jwt from "jsonwebtoken";

jest.mock("../../service/AuthService");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let controller: AuthController;
  let mockService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockService = new AuthService() as jest.Mocked<AuthService>;
    controller = new AuthController();
    (controller as any).service = mockService;

    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      const req: any = {
        body: {
          email: "ana.admin@empresa.com",
          senha: "Administrador$2025",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.login.mockResolvedValue({
        user: { accessToken: "jwt_token_aqui", nome: "Ana Clara Oliveira" },
      });

      await controller.login(req, res);

      expect(mockService.login).toHaveBeenCalledTimes(1);
      expect(mockService.login).toHaveBeenCalledWith({
        email: "ana.admin@empresa.com",
        senha: "Administrador$2025",
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it("deve lançar erro ao enviar body inválido no login", async () => {
      const req: any = { body: { email: "email-sem-senha" } };
      const res: any = {};

      await expect(controller.login(req, res)).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("deve realizar logout com sucesso", async () => {
      const req: any = {
        body: { access_token: "token_valido" },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: "6746fbe04ac227198311bf98",
      });

      mockService.logout.mockResolvedValue({
        data: { _id: "6746fbe04ac227198311bf98", nome: "User" },
      } as any);

      await controller.logout(req, res);

      expect(jwt.verify).toHaveBeenCalled();
      expect(mockService.logout).toHaveBeenCalledWith(
        "6746fbe04ac227198311bf98"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logout realizado com sucesso",
        data: null,
        errors: [],
      });
    });

    it("deve aceitar token no header Authorization", async () => {
      const req: any = {
        headers: { authorization: "Bearer token_header" },
        body: {},
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: "6746fbe04ac227198311bf98",
      });

      mockService.logout.mockResolvedValue({
        data: { _id: "6746fbe04ac227198311bf98", nome: "User" },
      } as any);

      await controller.logout(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(
        "token_header",
        process.env.JWT_SECRET_ACCESS_TOKEN!
      );

      expect(mockService.logout).toHaveBeenCalledWith(
        "6746fbe04ac227198311bf98"
      );
    });

    it("deve lançar erro se token estiver ausente", async () => {
      const req: any = { body: {}, headers: {} };
      const res: any = {};

      await expect(controller.logout(req, res)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se jwt.verify retornar objeto inválido", async () => {
      const req: any = { body: { access_token: "token_invalido" } };
      const res: any = {};

      (jwt.verify as jest.Mock).mockReturnValue(null);

      await expect(controller.logout(req, res)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se ID for inválido no MongoIdSchema", async () => {
      const req: any = { body: { access_token: "token" } };
      const res: any = {};

      (jwt.verify as jest.Mock).mockReturnValue({ id: "ID_INVALIDO" });

      await expect(controller.logout(req, res)).rejects.toThrow();
    });
  });
});
