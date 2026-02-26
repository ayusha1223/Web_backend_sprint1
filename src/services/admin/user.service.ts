import bcrypt from "bcryptjs";
import { AdminCreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { UserRepository } from "../../repositories/user.repository";
import { HttpError } from "../../errors/http-error";

export class AdminUserService {
  constructor(private userRepository = new UserRepository()) {}

  /* ================= CREATE USER ================= */
  async createUser(data: AdminCreateUserDTO) {

    const emailExists = await this.userRepository.getUserByEmail(data.email);
    if (emailExists) {
      throw new HttpError(403, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    return await this.userRepository.createUser(data);
  }

  /* ================= GET ALL USERS ================= */
  async getAllUsers(page: number, limit: number) {
    return await this.userRepository.getAllUsers(page, limit);
  }

  /* ================= GET USER BY ID ================= */
  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  /* ================= UPDATE USER ================= */
  async updateUser(id: string, updateData: UpdateUserDTO) {

    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) {
      throw new HttpError(404, "User not found");
    }

    /* ===== CHECK EMAIL CHANGE ===== */
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.userRepository.getUserByEmail(updateData.email);
      if (emailExists) {
        throw new HttpError(403, "Email already in use");
      }
    }

    /* ===== HASH PASSWORD IF PROVIDED ===== */
    if (updateData.password && updateData.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    } else {
      delete updateData.password; // don't overwrite with empty
    }

    return await this.userRepository.updateUser(id, updateData);
  }

  /* ================= DELETE USER ================= */
  async deleteUser(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return await this.userRepository.deleteUser(id);
  }
}