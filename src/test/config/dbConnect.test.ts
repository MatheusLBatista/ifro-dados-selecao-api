import DbConnect from "../../config/DbConnect";
import mongoose from "mongoose";
import logger from "../../utils/logger";

jest.mock("dotenv");
jest.mock("mongoose");
jest.mock("../../utils/logger");

describe("DbConnect", () => {
  let mockMongoose: jest.Mocked<typeof mongoose>;
  let mockLogger: jest.Mocked<typeof logger>;

  beforeEach(() => {
    mockMongoose = mongoose as jest.Mocked<typeof mongoose>;
    mockLogger = logger as jest.Mocked<typeof logger>;
    jest.clearAllMocks();

    // Mock mongoose connection
    Object.defineProperty(mockMongoose, "connection", {
      value: {
        on: jest.fn(),
      },
      writable: true,
    });
  });

  describe("conectar", () => {
    beforeEach(() => {
      // Mock process.env
      process.env.DB_URL = "mongodb://localhost:27017/test";
      process.env.NODE_ENV = "development";
    });

    it("deve conectar com sucesso no ambiente de desenvolvimento", async () => {
      mockMongoose.connect.mockResolvedValue({} as any);

      await DbConnect.conectar();

      expect(mockMongoose.set).toHaveBeenCalledWith("strictQuery", false);
      expect(mockMongoose.set).toHaveBeenCalledWith("autoIndex", true);
      expect(mockMongoose.set).toHaveBeenCalledWith("debug", true);
      expect(mockMongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/test",
        {
          serverSelectionTimeoutMS: 7000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
          retryWrites: true,
          maxPoolSize: 10,
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith("DB_URL está definida.");
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Conexão com o banco estabelecida!"
      );
    });

    it("deve conectar com sucesso no ambiente de produção", async () => {
      process.env.NODE_ENV = "production";

      mockMongoose.connect.mockResolvedValue({} as any);

      await DbConnect.conectar();

      expect(mockMongoose.set).toHaveBeenCalledWith("strictQuery", true);
      expect(mockMongoose.set).toHaveBeenCalledWith("autoIndex", false);
      expect(mockMongoose.set).toHaveBeenCalledWith("debug", false);
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Configurações de produção ativadas: autoIndex e debug desativados."
      );
    });

    it("deve conectar com sucesso no ambiente de teste", async () => {
      process.env.NODE_ENV = "test";

      mockMongoose.connect.mockResolvedValue({} as any);

      await DbConnect.conectar();

      expect(mockMongoose.set).toHaveBeenCalledWith("strictQuery", false);
      expect(mockMongoose.set).toHaveBeenCalledWith("autoIndex", false);
      expect(mockMongoose.set).toHaveBeenCalledWith("debug", false);
    });

    it("deve usar configurações customizadas do ambiente", async () => {
      process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS = "5000";
      process.env.MONGO_SOCKET_TIMEOUT_MS = "30000";
      process.env.MONGO_CONNECT_TIMEOUT_MS = "5000";
      process.env.MONGO_MAX_POOL_SIZE = "5";

      mockMongoose.connect.mockResolvedValue({} as any);

      await DbConnect.conectar();

      expect(mockMongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/test",
        {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 30000,
          connectTimeoutMS: 5000,
          retryWrites: true,
          maxPoolSize: 5,
        }
      );
    });

    it("deve configurar event listeners de conexão", async () => {
      mockMongoose.connect.mockResolvedValue({} as any);

      await DbConnect.conectar();

      expect(mockMongoose.connection.on).toHaveBeenCalledWith(
        "connected",
        expect.any(Function)
      );
      expect(mockMongoose.connection.on).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
      expect(mockMongoose.connection.on).toHaveBeenCalledWith(
        "disconnected",
        expect.any(Function)
      );
    });

    it("deve logar erro quando a conexão falha", async () => {
      const error = new Error("Connection failed");
      mockMongoose.connect.mockRejectedValue(error);

      await DbConnect.conectar();

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Erro na conexão com o banco de dados")
      );
    });
  });

  describe("desconectar", () => {
    it("deve desconectar com sucesso", async () => {
      mockMongoose.disconnect.mockResolvedValue({} as any);

      await DbConnect.desconectar();

      expect(mockMongoose.disconnect).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Conexão com o banco encerrada!"
      );
    });

    it("deve logar erro quando a desconexão falha", async () => {
      const error = new Error("Disconnect failed");
      mockMongoose.disconnect.mockRejectedValue(error);

      await DbConnect.desconectar();

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Erro ao desconectar do banco de dados")
      );
    });
  });
});
