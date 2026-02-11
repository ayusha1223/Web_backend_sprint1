import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  private service = new ProductService();

  async create(req: Request, res: Response) {
    try {
      const images = req.files
        ? (req.files as Express.Multer.File[]).map(
            (file) => `/uploads/${file.filename}`
          )
        : [];

      const product = await this.service.createProduct({
        ...req.body,
        images,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: "Create failed" });
    }
  }

  async getAll(req: Request, res: Response) {
    const products = await this.service.getAllProducts();
    res.json({ success: true, data: products });
  }

  async update(req: Request, res: Response) {
    const product = await this.service.updateProduct(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: product });
  }

  async delete(req: Request, res: Response) {
    await this.service.deleteProduct(req.params.id);
    res.json({ success: true });
  }
}
