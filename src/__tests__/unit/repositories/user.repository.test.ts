import { UserRepository } from "../../../repositories/user.repository";
import User from "../../../models/user.model";

jest.mock("../../../models/user.model");

describe("UserRepository", () => {
  let repo: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new UserRepository();
  });

  /* ================= CREATE USER ================= */

  it("should create user", async () => {
    const saveMock = jest.fn().mockResolvedValue({ email: "test@test.com" });

    (User as any).mockImplementation(() => ({
      save: saveMock,
    }));

    const result = await repo.createUser({ email: "test@test.com" });

    expect(saveMock).toHaveBeenCalled();
    expect(result.email).toBe("test@test.com");
  });

  /* ================= GET BY EMAIL ================= */

  it("should get user by email", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: "a@test.com" });

    const result = await repo.getUserByEmail("a@test.com");

    expect(User.findOne).toHaveBeenCalledWith({ email: "a@test.com" });
    expect(result?.email).toBe("a@test.com");
  });

  /* ================= GET BY USERNAME ================= */

  it("should get user by username", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ username: "ayusha" });

    const result = await repo.getUserByUsername("ayusha");

    expect(User.findOne).toHaveBeenCalledWith({ username: "ayusha" });
    expect(result?.username).toBe("ayusha");
  });

  /* ================= GET BY ID ================= */

  it("should get user by id without password", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "123" }),
    });

    const result = await repo.getUserById("123");

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(result?._id).toBe("123");
  });

  /* ================= GET ALL USERS (PAGINATION) ================= */

  it("should return paginated users", async () => {
    (User.countDocuments as jest.Mock).mockResolvedValue(20);

    (User.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue([{ name: "User1" }]),
    });

    const result = await repo.getAllUsers(2, 5);

    expect(User.countDocuments).toHaveBeenCalled();
    expect(result.users).toHaveLength(1);
    expect(result.pagination.total).toBe(20);
    expect(result.pagination.totalPages).toBe(4);
  });

  /* ================= UPDATE USER ================= */

  it("should clean undefined fields and update user", async () => {
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ name: "Updated" }),
    });

    const result = await repo.updateUser("123", {
      name: "Updated",
      phone: undefined,
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { $set: { name: "Updated" } },
      { new: true, runValidators: true }
    );

    expect(result?.name).toBe("Updated");
  });

  /* ================= DELETE USER ================= */

  it("should return true if user deleted", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "123" });

    const result = await repo.deleteUser("123");

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(result).toBe(true);
  });

  it("should return false if user not found", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await repo.deleteUser("999");

    expect(result).toBe(false);
  });
});