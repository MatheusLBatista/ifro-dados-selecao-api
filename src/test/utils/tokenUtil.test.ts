import { TokenUtil } from "../../utils/TokenUtil";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("TokenUtil", () => {
  let tokenUtil: TokenUtil;
  const mockId = "user123";
  const mockAccessToken = "access.jwt.token";
  const mockRefreshToken = "refresh.jwt.token";
  const mockRecoveryToken = "recovery.jwt.token";

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.JWT_SECRET_ACCESS_TOKEN = "access_secret";
    process.env.JWT_SECRET_REFRESH_TOKEN = "refresh_secret";
    process.env.JWT_SECRET_PASSWORD_RECOVERY = "recovery_secret";
    process.env.JWT_ACCESS_TOKEN_EXPIRATION = "1d";
    process.env.JWT_REFRESH_TOKEN_EXPIRATION = "7d";
    process.env.JWT_PASSWORD_RECOVERY_EXPIRATION = "30m";

    tokenUtil = new TokenUtil();
  });

  afterEach(() => {
    delete process.env.JWT_SECRET_ACCESS_TOKEN;
    delete process.env.JWT_SECRET_REFRESH_TOKEN;
    delete process.env.JWT_SECRET_PASSWORD_RECOVERY;
    delete process.env.JWT_ACCESS_TOKEN_EXPIRATION;
    delete process.env.JWT_REFRESH_TOKEN_EXPIRATION;
    delete process.env.JWT_PASSWORD_RECOVERY_EXPIRATION;
  });

  describe("generateAccessToken", () => {
    it("deve gerar access token com sucesso", async () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

      const result = await tokenUtil.generateAccessToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "access_secret", {
        expiresIn: "1d",
      });
      expect(result).toBe(mockAccessToken);
    });

    it("deve usar valor padrão de expiração quando não definido", async () => {
      delete process.env.JWT_ACCESS_TOKEN_EXPIRATION;

      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

      await tokenUtil.generateAccessToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "access_secret", {
        expiresIn: "1d",
      });
    });

    it("deve rejeitar quando jwt.sign lança erro", async () => {
      const error = new Error("JWT sign failed");
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(tokenUtil.generateAccessToken(mockId)).rejects.toThrow(
        "JWT sign failed"
      );
    });
  });

  describe("generateRefreshToken", () => {
    it("deve gerar refresh token com sucesso", async () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken);

      const result = await tokenUtil.generateRefreshToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "refresh_secret", {
        expiresIn: "7d",
      });
      expect(result).toBe(mockRefreshToken);
    });

    it("deve usar valor padrão de expiração quando não definido", async () => {
      delete process.env.JWT_REFRESH_TOKEN_EXPIRATION;

      (jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken);

      await tokenUtil.generateRefreshToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "refresh_secret", {
        expiresIn: "7d",
      });
    });

    it("deve rejeitar quando jwt.sign lança erro", async () => {
      const error = new Error("JWT sign failed");
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(tokenUtil.generateRefreshToken(mockId)).rejects.toThrow(
        "JWT sign failed"
      );
    });
  });

  describe("generatePasswordRecoveryToken", () => {
    it("deve gerar password recovery token com sucesso", async () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockRecoveryToken);

      const result = await tokenUtil.generatePasswordRecoveryToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "recovery_secret", {
        expiresIn: "30m",
      });
      expect(result).toBe(mockRecoveryToken);
    });

    it("deve usar valor padrão de expiração quando não definido", async () => {
      delete process.env.JWT_PASSWORD_RECOVERY_EXPIRATION;

      (jwt.sign as jest.Mock).mockReturnValue(mockRecoveryToken);

      await tokenUtil.generatePasswordRecoveryToken(mockId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockId }, "recovery_secret", {
        expiresIn: "30m",
      });
    });

    it("deve rejeitar quando jwt.sign lança erro", async () => {
      const error = new Error("JWT sign failed");
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        tokenUtil.generatePasswordRecoveryToken(mockId)
      ).rejects.toThrow("JWT sign failed");
    });
  });
});
