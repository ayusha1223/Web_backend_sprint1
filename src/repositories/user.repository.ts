import User, { IUser } from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result ? true : false;
  }
}
