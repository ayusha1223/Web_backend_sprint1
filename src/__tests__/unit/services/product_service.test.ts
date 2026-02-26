import { ProductService } from "../../../services/product.service";
import { ProductRepository } from "../../../repositories/product.repository";
import Product from "../../../models/product.model";

jest.mock("../../../repositories/product.repository");
jest.mock("../../../models/product.model");

describe("ProductService Unit Tests", () => {
  let service: ProductService;
  let mockRepo: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    (ProductRepository as jest.Mock).mockImplementation(() => mockRepo);

    service = new ProductService();
  });

  // =========================
  // CREATE PRODUCT
  // =========================

  it("should create a product", async () => {
    mockRepo.create.mockResolvedValue({ name: "Test Product" } as any);

    const result = await service.createProduct({ name: "Test Product" });

    expect(mockRepo.create).toHaveBeenCalledWith({ name: "Test Product" });
    expect(result.name).toBe("Test Product");
  });

  // =========================
  // GET ALL PRODUCTS
  // =========================

  it("should return all products", async () => {
    mockRepo.findAll.mockResolvedValue([{ name: "P1" }] as any);

    const result = await service.getAllProducts();

    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  // =========================
  // GET PRODUCT BY ID
  // =========================

  it("should return product by id", async () => {
    mockRepo.findById.mockResolvedValue({ _id: "123" } as any);

    const result = await service.getProductById("123");

    expect(mockRepo.findById).toHaveBeenCalledWith("123");
    expect(result?._id).toBe("123");
  });

  it("should return null if product not found", async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await service.getProductById("999");

    expect(result).toBeNull();
  });

  // =========================
  // UPDATE PRODUCT
  // =========================

  it("should update product", async () => {
    mockRepo.update.mockResolvedValue({ name: "Updated" } as any);

    const result = await service.updateProduct("123", { name: "Updated" });

    expect(mockRepo.update).toHaveBeenCalledWith("123", { name: "Updated" });
    expect(result.name).toBe("Updated");
  });

  // =========================
  // DELETE PRODUCT
  // =========================

  it("should delete product", async () => {
    mockRepo.delete.mockResolvedValue({ message: "Deleted" } as any);

    const result = await service.deleteProduct("123") as any;

    expect(mockRepo.delete).toHaveBeenCalledWith("123");
    expect(result.message).toBe("Deleted");
  });

  // =========================
  // GET PRODUCTS BY CATEGORY
  // =========================

  it("should return products by category", async () => {
    (Product.find as jest.Mock).mockResolvedValue([
      { name: "Category Product" },
    ]);

    const result = await service.getProductsByCategory("electronics");

    expect(Product.find).toHaveBeenCalledWith({ category: "electronics" });
    expect(result).toHaveLength(1);
  });

});