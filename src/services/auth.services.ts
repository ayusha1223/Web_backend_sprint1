import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthService {
  static async register(data: any) {
    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return AuthRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  static async login(data: any) {
  const user = await AuthRepository.findByEmail(data.email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      role: user.role,
      email: user.email,
    },
  };
}
}
