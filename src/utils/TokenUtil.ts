import jwt from "jsonwebtoken";

class TokenUtil {
  private readonly secretAccess = process.env.JWT_SECRET_ACCESS_TOKEN!;
  private readonly secretRefresh = process.env.JWT_SECRET_REFRESH_TOKEN!;
  private readonly secretRecovery = process.env.JWT_SECRET_PASSWORD_RECOVERY!;

  generateAccessToken(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = (jwt.sign as any)({ id }, this.secretAccess, {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1d",
        });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  generateRefreshToken(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = (jwt.sign as any)({ id }, this.secretRefresh, {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
        });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  generatePasswordRecoveryToken(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = (jwt.sign as any)({ id }, this.secretRecovery, {
          expiresIn: process.env.JWT_PASSWORD_RECOVERY_EXPIRATION || "30m",
        });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new TokenUtil();
