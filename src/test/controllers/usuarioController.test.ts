import UsuarioController from "../../controller/UsuarioController";
import UsuarioService from "../../service/UsuarioService";
import CustomError from "../../utils/helpers/CustomError";

jest.mock("../../service/UsuarioService");

describe("UsuarioController", () => {
  let controller: UsuarioController;
  let mockService: jest.Mocked<UsuarioService>;

  beforeEach(() => {
    mockService = new UsuarioService() as jest.Mocked<UsuarioService>;
    controller = new UsuarioController();
    (controller as any).service = mockService;
  });

  describe("create", () => {
    it("deve criar um usuário com sucesso", async () => {
      const req: any = {
        body: {
          nome: "João Silva",
          email: "joao@teste.com",
          telefone: "68999999999",
          senha: "Senha123!",
          data_nascimento: "01/01/1990",
          papel: "administrador",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.create.mockResolvedValue({
        _id: "123",
        nome: "João Silva",
        email: "joao@teste.com",
      } as any);

      await controller.create(req, res);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("deve lançar erro ao enviar body inválido no create", async () => {
      const req: any = { body: { nome: "" } };
      const res: any = {};

      await expect(controller.create(req, res)).rejects.toThrow();
    });
  });

  describe("read", () => {
    it("deve retornar um usuário por ID", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
        query: {},
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.read.mockResolvedValue({ nome: "João Silva" });

      await controller.read(req, res);

      expect(mockService.read).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Requisição bem-sucedida",
        data: { nome: "João Silva" },
        errors: [],
      });
    });

    it("deve lançar erro se o ID for inválido no read", async () => {
      const req: any = { params: { id: "ID_INVALIDO" }, query: {} };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.read(req, res)).rejects.toThrow();
    });

    it("deve validar query parameters válidos", async () => {
      const req: any = {
        params: {},
        query: { nome: "João", email: "joao@teste.com" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.read.mockResolvedValue([]);

      await controller.read(req, res);

      expect(mockService.read).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve lançar erro se query parameters forem inválidos", async () => {
      const req: any = {
        params: {},
        query: { email: "email-invalido" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.read(req, res)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("deve deletar um usuário com sucesso", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.deletar.mockResolvedValue({
        _id: "6746fbe04ac227198311bf98",
        nome: "João Silva",
      } as any);

      await controller.delete(req, res);

      expect(mockService.deletar).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuário excluído com sucesso.",
        data: { _id: "6746fbe04ac227198311bf98", nome: "João Silva" },
        errors: [],
      });
    });

    it("deve lançar erro se ID não for fornecido no delete", async () => {
      const req: any = { params: {} };
      const res: any = {};

      await expect(controller.delete(req, res)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se o ID for inválido no delete", async () => {
      const req: any = { params: { id: "ID_INVALIDO" } };
      const res: any = {};

      await expect(controller.delete(req, res)).rejects.toThrow();
    });
  });
});
