import Product from "../models/product.model";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    return this.repo.create(data);
  }

async getAllProducts(search?: string) {
  if (search) {
    return await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });
  }

  return this.repo.findAll(); // 🔥 important
}

  async getProductById(id: string) {
    return this.repo.findById(id);
  }

  async updateProduct(id: string, data: any) {
    return this.repo.update(id, data);
  }
  async getProductsByCategory(category: string) {
  return await Product.find({ category });
}

  async deleteProduct(id: string) {
    return this.repo.delete(id);
  }
}
