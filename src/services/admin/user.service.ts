import bcrypt from "bcryptjs";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { UserRepository } from "../../repositories/user.repository";
import { HttpError } from "../../errors/http-error";


const userRepository = new UserRepository();

export class AdminUserService {

  async createUser(data: CreateUserDTO) {
    // check email
    const emailExists = await userRepository.getUserByEmail(data.email);
    if (emailExists) {
      throw new HttpError(403, "Email already in use");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const newUser = await userRepository.createUser(data);
    return newUser;
  }

  async getAllUsers(page: number, limit: number) {
  return await userRepository.getAllUsers(page, limit);
}

  async getUserById(id: string) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async updateUser(id: string, updateData: UpdateUserDTO) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return await userRepository.updateUser(id, updateData);
  }

  async deleteUser(id: string) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return await userRepository.deleteUser(id);
  }
}
