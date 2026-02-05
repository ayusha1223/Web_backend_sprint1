import { Request, Response } from "express";

export class CartController {
  static async getCart(req: Request, res: Response) {
    res.json({ message: "GET CART (to be connected)" });
  }

  static async saveCart(req: Request, res: Response) {
    res.json({ message: "SAVE CART (to be connected)" });
  }
}
