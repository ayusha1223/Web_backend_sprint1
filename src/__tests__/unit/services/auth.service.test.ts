;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../../../repositories/auth.repository";
import { AuthService } from "../../../services/auth.services";

jest.mock("../../../repositories/auth.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // REGISTER
  // =========================

  it("should throw error if email already exists", async () => {
    (AuthRepository.findByEmail as jest.Mock).mockResolvedValue({
      email: "test@test.com"
    });

    await expect(
      AuthService.register({
        email: "test@test.com",
        password: "123456"
      })
    ).rejects.toThrow("Email already exists");
  });

  it("should hash password and create user", async () => {
    (AuthRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (AuthRepository.createUser as jest.Mock).mockResolvedValue({
      email: "test@test.com"
    });

    const result = await AuthService.register({
      email: "test@test.com",
      password: "123456"
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(AuthRepository.createUser).toHaveBeenCalled();
    expect(result.email).toBe("test@test.com");
  });

  // =========================
  // LOGIN
  // =========================

  it("should throw error if user not found during login", async () => {
    (AuthRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.login({
        email: "wrong@test.com",
        password: "123456"
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw error if password does not match", async () => {
    (AuthRepository.findByEmail as jest.Mock).mockResolvedValue({
      password: "hashed"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      AuthService.login({
        email: "test@test.com",
        password: "wrongpass"
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should generate token and return user on successful login", async () => {
    const mockUser = {
      _id: "123",
      role: "user",
      email: "test@test.com",
      password: "hashed",
      name: "Test",
      firstName: "Test",
      lastName: "User",
      imageUrl: "image.jpg"
    };

    (AuthRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const result = await AuthService.login({
      email: "test@test.com",
      password: "123456"
    });

    expect(jwt.sign).toHaveBeenCalled();
    expect(result.token).toBe("mockToken");
    expect(result.user.email).toBe("test@test.com");
  });

  // =========================
  // GET CURRENT USER
  // =========================

  it("should throw error if user not found in getCurrentUser", async () => {
    (AuthRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.getCurrentUser("123")
    ).rejects.toThrow("User not found");
  });

  it("should return formatted user data", async () => {
    const mockUser = {
      _id: "123",
      email: "test@test.com",
      role: "admin",
      name: "Test",
      imageUrl: "image.jpg"
    };

    (AuthRepository.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await AuthService.getCurrentUser("123");

    expect(result.email).toBe("test@test.com");
    expect(result.role).toBe("admin");
  });

});