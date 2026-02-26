jest.mock("../../../repositories/user.repository");
jest.mock("bcryptjs");

import bcrypt from "bcryptjs";
import { AdminUserService } from "../../../services/admin/user.service";
import { UserRepository } from "../../../repositories/user.repository";
import { HttpError } from "../../../errors/http-error";

describe("AdminUserService Unit Tests", () => {
  let service: AdminUserService;
  let mockRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    (UserRepository as jest.Mock).mockImplementation(() => mockRepo);

    service = new AdminUserService();
  });

  // ================= CREATE USER =================

  it("should throw error if email already exists", async () => {
    mockRepo.getUserByEmail.mockResolvedValue({ email: "test@test.com" });

    await expect(
      service.createUser({
        email: "test@test.com",
        password: "123456",
      } as any)
    ).rejects.toThrow(HttpError);
  });

  it("should hash password and create user", async () => {
    mockRepo.getUserByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    mockRepo.createUser.mockResolvedValue({ email: "new@test.com" });

    const result: any = await service.createUser({
      email: "new@test.com",
      password: "123456",
    } as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(mockRepo.createUser).toHaveBeenCalled();
    expect(result.email).toBe("new@test.com");
  });

  // ================= GET ALL USERS =================

  it("should return paginated users", async () => {
    mockRepo.getAllUsers.mockResolvedValue([{ email: "user@test.com" }]);

    const result: any = await service.getAllUsers(1, 10);

    expect(mockRepo.getAllUsers).toHaveBeenCalledWith(1, 10);
    expect(result.length).toBe(1);
  });

  // ================= GET USER BY ID =================

  it("should throw error if user not found", async () => {
    mockRepo.getUserById.mockResolvedValue(null);

    await expect(service.getUserById("123")).rejects.toThrow(HttpError);
  });

  it("should return user if found", async () => {
    mockRepo.getUserById.mockResolvedValue({ _id: "123" });

    const result: any = await service.getUserById("123");

    expect(result._id).toBe("123");
  });

  // ================= UPDATE USER =================

  it("should throw error if user does not exist during update", async () => {
    mockRepo.getUserById.mockResolvedValue(null);

    await expect(
      service.updateUser("123", { name: "Updated" } as any)
    ).rejects.toThrow(HttpError);
  });

  it("should throw error if updating email to existing one", async () => {
    mockRepo.getUserById.mockResolvedValue({ email: "old@test.com" });
    mockRepo.getUserByEmail.mockResolvedValue({ email: "new@test.com" });

    await expect(
      service.updateUser("123", { email: "new@test.com" } as any)
    ).rejects.toThrow(HttpError);
  });

  it("should hash password if provided in update", async () => {
    mockRepo.getUserById.mockResolvedValue({ email: "old@test.com" });
    mockRepo.getUserByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
    mockRepo.updateUser.mockResolvedValue({ password: "hashedPass" });

    const result: any = await service.updateUser("123", {
      password: "newpass",
    } as any);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(result.password).toBe("hashedPass");
  });

  it("should remove empty password during update", async () => {
    mockRepo.getUserById.mockResolvedValue({ email: "old@test.com" });
    mockRepo.getUserByEmail.mockResolvedValue(null);
    mockRepo.updateUser.mockResolvedValue({ name: "Updated" });

    const result: any = await service.updateUser("123", {
      password: "",
    } as any);

    expect(result.name).toBe("Updated");
  });

  // ================= DELETE USER =================

  it("should throw error if deleting non-existent user", async () => {
    mockRepo.getUserById.mockResolvedValue(null);

    await expect(service.deleteUser("123")).rejects.toThrow(HttpError);
  });

  it("should delete user if exists", async () => {
    mockRepo.getUserById.mockResolvedValue({ _id: "123" });
    mockRepo.deleteUser.mockResolvedValue({ message: "Deleted" });

    const result: any = await service.deleteUser("123");

    expect(mockRepo.deleteUser).toHaveBeenCalledWith("123");
    expect(result.message).toBe("Deleted");
  });

});