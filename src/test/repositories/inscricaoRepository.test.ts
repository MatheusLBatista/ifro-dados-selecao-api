import InscricaoRepository from "../../repository/InscricaoRepository";
import Inscricao, { Status } from "../../models/Inscricao";
import InscricaoFilterBuild from "../../repository/filters/InscricaoFilterBuild";
import { InscricaoDTO } from "../../utils/validators/schemas/InscricaoSchema";
import { CustomError } from "../../utils/helpers";

jest.mock("../../models/Inscricao");
jest.mock("../../repository/filters/InscricaoFilterBuild");

describe("InscricaoRepository", () => {
  let repository: InscricaoRepository;
  let mockInscricao: jest.Mocked<typeof Inscricao>;
  let mockFilterBuilder: jest.Mocked<InscricaoFilterBuild>;

  beforeEach(() => {
    mockInscricao = Inscricao as jest.Mocked<typeof Inscricao>;
    mockFilterBuilder =
      new InscricaoFilterBuild() as jest.Mocked<InscricaoFilterBuild>;
    (
      InscricaoFilterBuild as jest.MockedClass<typeof InscricaoFilterBuild>
    ).mockImplementation(() => mockFilterBuilder);
    repository = new InscricaoRepository();
    jest.clearAllMocks();
  });

  describe("read", () => {
    it("deve retornar inscrições com filtros", async () => {
      const req = {
        query: {
          nome: "João",
          email: "joao@teste.com",
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
      };

      mockFilterBuilder.comNome.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comEmail.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.build.mockReturnValue(expectedFilters);

      const mockPaginate = jest.fn().mockResolvedValue(mockData);
      (mockInscricao as any).paginate = mockPaginate;

      const result = await repository.read(req);

      expect(mockFilterBuilder.comNome).toHaveBeenCalledWith("João");
      expect(mockFilterBuilder.comEmail).toHaveBeenCalledWith("joao@teste.com");
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
      (mockInscricao as any).paginate = mockPaginate;

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

  describe("findEvaluated", () => {
    it("deve retornar inscrições avaliadas com filtros", async () => {
      const req = {
        query: {
          nome: "João",
          email: "joao@teste.com",
          status: "APROVADO",
          pontuacaoMin: "7",
          pontuacaoMax: "9",
          page: "1",
          limite: "10",
        },
      } as any;
      const mockData = {
        docs: [{ nome: "João", pontuacao: 8 }],
        totalDocs: 1,
        totalPages: 1,
      };
      const expectedFilters = {
        nome: { $regex: "João", $options: "i" },
        email: { $regex: "joao@teste.com", $options: "i" },
        status: { $regex: "APROVADO", $options: "i" },
        pontuacao: { $gte: 7, $lte: 9 },
        $and: [{ pontuacao: { $ne: null } }],
      };

      mockFilterBuilder.comPontuacaoAvaliada.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comNome.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comEmail.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comStatus.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.comPontuacaoEntre.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.build.mockReturnValue(expectedFilters);

      const mockPaginate = jest.fn().mockResolvedValue(mockData);
      (mockInscricao as any).paginate = mockPaginate;

      const result = await repository.findEvaluated(req);

      expect(mockFilterBuilder.comPontuacaoAvaliada).toHaveBeenCalled();
      expect(mockFilterBuilder.comNome).toHaveBeenCalledWith("João");
      expect(mockFilterBuilder.comEmail).toHaveBeenCalledWith("joao@teste.com");
      expect(mockFilterBuilder.comStatus).toHaveBeenCalledWith("APROVADO");
      expect(mockFilterBuilder.comPontuacaoEntre).toHaveBeenCalledWith(7, 9);
      expect(mockFilterBuilder.build).toHaveBeenCalled();
      expect(mockPaginate).toHaveBeenCalledWith(expectedFilters, {
        page: 1,
        limit: 10,
        sort: { createdAt: -1 },
        lean: true,
      });
      expect(result).toBe(mockData);
    });

    it("deve usar valores padrão para pontuação", async () => {
      const req = { query: {} } as any;
      const mockData = { docs: [], totalDocs: 0, totalPages: 0 };
      const expectedFilters = { $and: [{ pontuacao: { $ne: null } }] };

      mockFilterBuilder.comPontuacaoAvaliada.mockReturnValue(mockFilterBuilder);
      mockFilterBuilder.build.mockReturnValue(expectedFilters);

      const mockPaginate = jest.fn().mockResolvedValue(mockData);
      (mockInscricao as any).paginate = mockPaginate;

      const result = await repository.findEvaluated(req);

      expect(mockFilterBuilder.comPontuacaoAvaliada).toHaveBeenCalled();
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
    it("deve criar inscrição com sucesso", async () => {
      const parsedData: InscricaoDTO = {
        nome: "João Silva",
        email: "joao@teste.com",
        telefone: "68999999999",
        data_nascimento: new Date("1990-01-01"),
        background: [],
        experiencia: "2 anos",
        area_interesse: "tecnologia",
      };
      const mockCreated = {
        ...parsedData,
        _id: "123",
        save: jest.fn().mockResolvedValue({ ...parsedData, _id: "123" }),
      };

      mockInscricao.create.mockResolvedValue(mockCreated as any);

      const result = await repository.create(parsedData);

      expect(mockInscricao.create).toHaveBeenCalledWith(parsedData);
      expect(mockCreated.save).toHaveBeenCalled();
      expect(result).toEqual({ ...parsedData, _id: "123" });
    });
  });

  describe("evaluate", () => {
    it("deve avaliar inscrição com sucesso", async () => {
      const id = "123";
      const parsedData: Partial<InscricaoDTO> = { pontuacao: 8 };
      const mockUpdated = { _id: "123", pontuacao: 8 };

      mockInscricao.findByIdAndUpdate.mockResolvedValue(mockUpdated as any);

      const result = await repository.evaluate(id, parsedData as InscricaoDTO);

      expect(mockInscricao.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        parsedData,
        { new: true }
      );
      expect(result).toBe(mockUpdated);
    });
  });

  describe("approve", () => {
    it("deve aprovar inscrição com sucesso", async () => {
      const id = "123";
      const parsedData: Partial<InscricaoDTO> = { status: Status.APROVADO };
      const mockUpdated = { _id: "123", status: Status.APROVADO };

      mockInscricao.findByIdAndUpdate.mockResolvedValue(mockUpdated as any);

      const result = await repository.approve(id, parsedData as InscricaoDTO);

      expect(mockInscricao.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        parsedData,
        { new: true }
      );
      expect(result).toBe(mockUpdated);
    });
  });

  describe("findByEmail", () => {
    it("deve encontrar inscrição por email", async () => {
      const email = "joao@teste.com";
      const mockInscricaoDoc = { email };

      mockInscricao.findOne.mockResolvedValue(mockInscricaoDoc as any);

      const result = await repository.findByEmail(email);

      expect(mockInscricao.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBe(mockInscricaoDoc);
    });

    it("deve retornar null quando email não encontrado", async () => {
      const email = "naoexiste@teste.com";

      mockInscricao.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(mockInscricao.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe("findByNome", () => {
    it("deve encontrar inscrição por nome", async () => {
      const nome = "João Silva";
      const mockInscricaoDoc = { nome };

      mockInscricao.findOne.mockResolvedValue(mockInscricaoDoc as any);

      const result = await repository.findByNome(nome);

      expect(mockInscricao.findOne).toHaveBeenCalledWith({ nome });
      expect(result).toBe(mockInscricaoDoc);
    });

    it("deve retornar null quando nome não encontrado", async () => {
      const nome = "Nome Inexistente";

      mockInscricao.findOne.mockResolvedValue(null);

      const result = await repository.findByNome(nome);

      expect(mockInscricao.findOne).toHaveBeenCalledWith({ nome });
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("deve encontrar inscrição por ID", async () => {
      const id = "123";
      const mockInscricaoDoc = { _id: "123", nome: "João" };

      mockInscricao.findById.mockResolvedValue(mockInscricaoDoc as any);

      const result = await repository.findById(id);

      expect(mockInscricao.findById).toHaveBeenCalledWith("123");
      expect(result).toBe(mockInscricaoDoc);
    });

    it("deve lançar erro quando inscrição não encontrada", async () => {
      const id = "123";

      mockInscricao.findById.mockResolvedValue(null);

      await expect(repository.findById(id)).rejects.toThrow(CustomError);
      expect(mockInscricao.findById).toHaveBeenCalledWith("123");
    });
  });
});
