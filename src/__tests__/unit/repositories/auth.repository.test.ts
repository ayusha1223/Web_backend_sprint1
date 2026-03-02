import { AuthRepository } from "../../../repositories/auth.repository";
import User from "../../../models/user.model";

jest.mock("../../../models/user.model");

describe("AuthRepository", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ================= THROW METHOD ================= */

  it("should throw error for findUserByEmail instance method", () => {
    const repo = new AuthRepository();

    expect(() => repo.findUserByEmail("test@test.com"))
      .toThrow("Method not implemented.");
  });

  /* ================= STATIC findByEmail ================= */

  it("should find user by email", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: "test@test.com" });

    const result = await AuthRepository.findByEmail("test@test.com");

    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@test.com",
    });

    expect(result.email).toBe("test@test.com");
  });

  /* ================= STATIC createUser ================= */

  it("should create user", async () => {
    (User.create as jest.Mock).mockResolvedValue({ name: "Ayusha" });

    const result = await AuthRepository.createUser({
      name: "Ayusha",
    });

    expect(User.create).toHaveBeenCalledWith({
      name: "Ayusha",
    });

    expect(result.name).toBe("Ayusha");
  });

  /* ================= STATIC findById ================= */

  it("should find user by id", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ _id: "123" });

    const result = await AuthRepository.findById("123");

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(result?._id).toBe("123");
  });

});