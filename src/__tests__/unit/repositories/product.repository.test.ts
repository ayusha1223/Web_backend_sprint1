import { ProductRepository } from "../../../repositories/product.repository";
import Product from "../../../models/product.model";

jest.mock("../../../models/product.model");

describe("ProductRepository", () => {
  let repo: ProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ProductRepository();
  });

  /* ================= CREATE ================= */

  it("should create product", async () => {
    (Product.create as jest.Mock).mockResolvedValue({ name: "Test" });

    const result = await repo.create({ name: "Test" });

    expect(Product.create).toHaveBeenCalledWith({ name: "Test" });
    expect(result.name).toBe("Test");
  });

  /* ================= FIND ALL ================= */

  it("should return all products sorted by createdAt desc", async () => {
    const sortMock = jest.fn().mockResolvedValue([{ name: "P1" }]);

    (Product.find as jest.Mock).mockReturnValue({
      sort: sortMock,
    });

    const result = await repo.findAll();

    expect(Product.find).toHaveBeenCalled();
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toHaveLength(1);
  });

  /* ================= FIND BY ID ================= */

  it("should find product by id", async () => {
    (Product.findById as jest.Mock).mockResolvedValue({ _id: "123" });

    const result = await repo.findById("123");

    expect(Product.findById).toHaveBeenCalledWith("123");
    expect(result?._id).toBe("123");
  });

  /* ================= UPDATE ================= */

  it("should update product", async () => {
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      name: "Updated",
    });

    const result = await repo.update("123", { name: "Updated" });

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { name: "Updated" },
      { new: true }
    );

    expect(result.name).toBe("Updated");
  });

  /* ================= DELETE ================= */
it("should delete product", async () => {
  (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({
    _id: "123",
    name: "Deleted Product",
  });

  const result = await repo.delete("123");

  expect(Product.findByIdAndDelete).toHaveBeenCalledWith("123");
  expect(result?._id).toBe("123");
});
});