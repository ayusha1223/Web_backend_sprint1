import {
  AdminCreateUserDTO,
  RegisterUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
} from "../../../dtos/user.dto";

describe("User DTO Validation Tests", () => {

  /* ================= ADMIN CREATE USER ================= */

  describe("AdminCreateUserDTO", () => {

    it("should validate correct admin user data", () => {
      const result = AdminCreateUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123456",
        role: "admin",
      });

      expect(result.success).toBe(true);
    });

    it("should fail for invalid email", () => {
      const result = AdminCreateUserDTO.safeParse({
        name: "Ayusha",
        email: "invalid",
        password: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("should fail for short password", () => {
      const result = AdminCreateUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });

    it("should fail for invalid role", () => {
      const result = AdminCreateUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123456",
        role: "manager", // invalid
      });

      expect(result.success).toBe(false);
    });

  });

  /* ================= REGISTER USER ================= */

  describe("RegisterUserDTO", () => {

    it("should validate correct registration data", () => {
      const result = RegisterUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
        phone: "12345",
      });

      expect(result.success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
      const result = RegisterUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "654321",
        phone: "12345",
      });

      expect(result.success).toBe(false);
    });

    it("should fail for short phone number", () => {
      const result = RegisterUserDTO.safeParse({
        name: "Ayusha",
        email: "test@test.com",
        password: "123456",
        confirmPassword: "123456",
        phone: "123",
      });

      expect(result.success).toBe(false);
    });

  });

  /* ================= LOGIN USER ================= */

  describe("LoginUserDTO", () => {

    it("should validate correct login data", () => {
      const result = LoginUserDTO.safeParse({
        email: "test@test.com",
        password: "123456",
      });

      expect(result.success).toBe(true);
    });

    it("should fail for invalid email", () => {
      const result = LoginUserDTO.safeParse({
        email: "invalid",
        password: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("should fail for short password", () => {
      const result = LoginUserDTO.safeParse({
        email: "test@test.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });

  });

  /* ================= UPDATE USER ================= */

  describe("UpdateUserDTO", () => {

    it("should allow partial update", () => {
      const result = UpdateUserDTO.safeParse({
        name: "Updated Name",
      });

      expect(result.success).toBe(true);
    });

    it("should allow empty password", () => {
      const result = UpdateUserDTO.safeParse({
        password: "",
      });

      expect(result.success).toBe(true);
    });

    it("should fail invalid role", () => {
      const result = UpdateUserDTO.safeParse({
        role: "manager",
      });

      expect(result.success).toBe(false);
    });

  });

});