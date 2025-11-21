import InscricaoController from "../../controller/InscricaoController";
import InscricaoService from "../../service/InscricaoService";
import CustomError from "../../utils/helpers/CustomError";

jest.mock("../../service/InscricaoService");

describe("InscricaoController", () => {
  let controller: InscricaoController;
  let mockService: jest.Mocked<InscricaoService>;

  beforeEach(() => {
    mockService = new InscricaoService() as jest.Mocked<InscricaoService>;
    controller = new InscricaoController();
    (controller as any).service = mockService;
  });

  describe("create", () => {
    it("deve criar uma inscrição com sucesso", async () => {
      const req: any = {
        body: {
          nome: "Matheus",
          email: "matheus@teste.com",
          telefone: "68999999999",
          data_nascimento: "01/01/2000",
          background: [
            {
              certificado: "certificado-teste.jpg",
              descricao: "Curso de javascript com next.js.",
            },
          ],
          experiencia: "2 anos de experiência em desenvolvimento web.",
          area_interesse: "tecnologia",
          status: "PENDENTE",
        },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.create.mockResolvedValue({
        _id: "123",
        nome: "Matheus",
      } as any);

      await controller.create(req, res);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith({
        nome: "Matheus",
        email: "matheus@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("2000-01-01T00:00:00.000Z"),
        background: [
          {
            certificado: "certificado-teste.jpg",
            descricao: "Curso de javascript com next.js.",
          },
        ],
        experiencia: "2 anos de experiência em desenvolvimento web.",
        area_interesse: "tecnologia",
        status: "PENDENTE",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Recurso criado com sucesso",
        data: { _id: "123", nome: "Matheus" },
        errors: [],
      });
    });
  });

  describe("read", () => {
    it("deve retornar uma inscrição por ID", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
        query: {},
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.read.mockResolvedValue({ nome: "Matheus" });

      await controller.read(req, res);

      expect(mockService.read).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Requisição bem-sucedida",
        data: { nome: "Matheus" },
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
        query: { nome: "João", status: "aprovado" },
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
        query: { status: "invalido" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.read(req, res)).rejects.toThrow();
    });
  });

  describe("findEvaluated", () => {
    it("deve retornar inscrições avaliadas", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
        query: {},
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.findEvaluated.mockResolvedValue({ resultado: "avaliado" });

      await controller.findEvaluated(req, res);

      expect(mockService.findEvaluated).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve validar query parameters válidos", async () => {
      const req: any = {
        params: {},
        query: { nome: "João", status: "aprovado" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.findEvaluated.mockResolvedValue([]);

      await controller.findEvaluated(req, res);

      expect(mockService.findEvaluated).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve lançar erro se query parameters forem inválidos", async () => {
      const req: any = {
        params: {},
        query: { status: "invalido" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.findEvaluated(req, res)).rejects.toThrow();
    });
  });

  describe("evaluate", () => {
    it("deve lançar erro se tentar avaliar sem ID", async () => {
      const req: any = { params: {}, body: {} };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.evaluate(req, res)).rejects.toThrow(CustomError);
    });

    it("deve avaliar uma inscrição com sucesso", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
        body: { status: "APROVADO" },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.evaluate.mockResolvedValue({
        _id: "6746fbe04ac227198311bf98",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("2000-01-01"),
        background: [],
        experiencia: "2 anos",
        area_interesse: "tecnologia",
        status: "APROVADO",
        toObject: () => ({
          _id: "6746fbe04ac227198311bf98",
          nome: "João Silva",
          email: "joao@teste.com",
          telefone: "68999999999",
          data_nascimento: new Date("2000-01-01"),
          background: [],
          experiencia: "2 anos",
          area_interesse: "tecnologia",
          status: "APROVADO",
        }),
      } as any);

      await controller.evaluate(req, res);

      expect(mockService.evaluate).toHaveBeenCalledWith(
        "6746fbe04ac227198311bf98",
        {
          status: "APROVADO",
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("approve", () => {
    it("deve lançar erro se tentar aprovar sem ID", async () => {
      const req: any = { params: {}, body: {} };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(controller.approve(req, res)).rejects.toThrow(CustomError);
    });

    it("deve aprovar uma inscrição com sucesso", async () => {
      const req: any = {
        params: { id: "6746fbe04ac227198311bf98" },
        body: { status: "APROVADO" },
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      mockService.approve.mockResolvedValue({
        _id: "6746fbe04ac227198311bf98",
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("2000-01-01"),
        background: [],
        experiencia: "2 anos",
        area_interesse: "tecnologia",
        status: "PENDENTE",
        toObject: () => ({
          _id: "6746fbe04ac227198311bf98",
          nome: "João Silva",
          email: "joao@teste.com",
          telefone: "68999999999",
          data_nascimento: new Date("2000-01-01"),
          background: [],
          experiencia: "2 anos",
          area_interesse: "tecnologia",
          status: "APROVADO",
        }),
      } as any);

      await controller.approve(req, res);

      expect(mockService.approve).toHaveBeenCalledWith(
        "6746fbe04ac227198311bf98",
        {
          status: "APROVADO",
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
