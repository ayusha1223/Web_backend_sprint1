import Product from "../models/product.model";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    return this.repo.create(data);
  }

  async getAllProducts() {
    return this.repo.findAll();
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
