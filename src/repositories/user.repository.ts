import User, { IUser } from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;

  getAllUsers(
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;

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
    return await User.findById(id).select("-password");
  }

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-password");

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* ✅ SAFE UPDATE */
  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {

    // Remove undefined fields
    const cleanData: any = {};

    Object.keys(updateData).forEach((key) => {
      const value = (updateData as any)[key];
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });

    return await User.findByIdAndUpdate(
      id,
      { $set: cleanData },  // 🔥 IMPORTANT
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result ? true : false;
  }
}