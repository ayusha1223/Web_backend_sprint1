import { Request, Response } from "express";
import { registerDto, loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerDto.parse(req.body);
      const user = await AuthService.register(data);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = loginDto.parse(req.body);
      const result = await AuthService.login(data);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
