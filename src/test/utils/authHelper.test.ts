import AuthHelper from "../../utils/AuthHelper";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("AuthHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("decodeToken", () => {
    it("deve decodificar token válido com sucesso", () => {
      const mockToken = "valid.jwt.token";
      const mockDecoded = { id: "123", iat: 1234567890, exp: 1234567890 };

      (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

      const result = AuthHelper.decodeToken(mockToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockDecoded);
    });

    it("deve retornar null quando ocorre erro na decodificação", () => {
      const mockToken = "invalid.jwt.token";

      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = AuthHelper.decodeToken(mockToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toBeNull();
    });

    it("deve retornar null quando jwt.decode retorna null", () => {
      const mockToken = "null.jwt.token";

      (jwt.decode as jest.Mock).mockReturnValue(null);

      const result = AuthHelper.decodeToken(mockToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toBeNull();
    });

    it("deve retornar null quando jwt.decode retorna undefined", () => {
      const mockToken = "undefined.jwt.token";

      (jwt.decode as jest.Mock).mockReturnValue(undefined);

      const result = AuthHelper.decodeToken(mockToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toBeUndefined();
    });
  });

  describe("hashPassword", () => {
    it("deve fazer hash da senha com sucesso", async () => {
      const password = "password123";
      const hashedPassword = "$2b$10$hashedPasswordHere";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await AuthHelper.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toEqual({ senha: hashedPassword });
    });

    it("deve propagar erro quando bcrypt.hash falha", async () => {
      const password = "password123";
      const error = new Error("Hash failed");

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(AuthHelper.hashPassword(password)).rejects.toThrow(
        "Hash failed"
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("deve usar salt rounds correto (10)", async () => {
      const password = "password123";
      const hashedPassword = "$2b$10$hashedPasswordHere";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await AuthHelper.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("deve retornar objeto com propriedade 'senha'", async () => {
      const password = "password123";
      const hashedPassword = "$2b$10$hashedPasswordHere";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await AuthHelper.hashPassword(password);

      expect(result).toHaveProperty("senha");
      expect(result.senha).toBe(hashedPassword);
    });
  });
});
