import Product from "../models/product.model";

export class ProductRepository {
  async create(data: any) {
    return Product.create(data);
  }

  async findAll() {
    return Product.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return Product.findById(id);
  }

  async update(id: string, data: any) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return Product.findByIdAndDelete(id);
  }
}
