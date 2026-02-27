import { ProductController } from "../../../controllers/product.controller";
import { ProductService } from "../../../services/product.service";

describe("ProductController Unit Tests", () => {
  let controller: ProductController;
  let mockService: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    mockService = {
      createProduct: jest.fn(),
      getAllProducts: jest.fn(),
      updateProduct: jest.fn(),
      getProductsByCategory: jest.fn(),
      deleteProduct: jest.fn(),
    };

    controller = new ProductController(mockService);

    req = {
      body: {},
      params: {},
      files: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ================= CREATE =================

  it("should create product successfully", async () => {
    req.body = { name: "Test Product" };
    mockService.createProduct.mockResolvedValue({ name: "Test Product" });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { name: "Test Product" },
    });
  });

  it("should handle create error", async () => {
    mockService.createProduct.mockRejectedValue(new Error("Fail"));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Create failed",
    });
  });

  it("should map uploaded files correctly", async () => {
    req.files = [{ filename: "image1.jpg" }];
    mockService.createProduct.mockResolvedValue({});

    await controller.create(req, res);

    expect(mockService.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        images: ["/uploads/image1.jpg"],
      })
    );
  });

  // ================= GET ALL =================

it("should return all products", async () => {
  req.query = {}; // use existing req
  mockService.getAllProducts.mockResolvedValue([{ name: "P1" }]);

  await controller.getAll(req, res);

  expect(mockService.getAllProducts).toHaveBeenCalledWith(undefined);

  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: [{ name: "P1" }],
  });
});

  // ================= UPDATE =================

  it("should update product", async () => {
    req.params.id = "123";
    req.body = { name: "Updated" };
    mockService.updateProduct.mockResolvedValue({ name: "Updated" });

    await controller.update(req, res);

    expect(mockService.updateProduct).toHaveBeenCalledWith(
      "123",
      { name: "Updated" }
    );

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { name: "Updated" },
    });
  });

  // ================= GET BY CATEGORY =================

  it("should return products by category", async () => {
    req.params.category = "electronics";
    mockService.getProductsByCategory.mockResolvedValue([{ name: "TV" }]);

    await controller.getByCategory(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ name: "TV" }],
    });
  });

  it("should handle category fetch error", async () => {
    req.params.category = "electronics";
    mockService.getProductsByCategory.mockRejectedValue(new Error());

    await controller.getByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Fetch failed",
    });
  });

  // ================= DELETE =================

  it("should delete product", async () => {
    req.params.id = "123";
    mockService.deleteProduct.mockResolvedValue(undefined);

    await controller.delete(req, res);

    expect(mockService.deleteProduct).toHaveBeenCalledWith("123");

    expect(res.json).toHaveBeenCalledWith({
      success: true,
    });
  });
});