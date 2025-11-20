import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthHelper {
    static decodeToken(token: string) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }

    static async hashPassword(password: string): Promise<{ senha: string }> {
        const hashed = await bcrypt.hash(password, 10);
        return { senha: hashed };
    }
}

export default AuthHelper;