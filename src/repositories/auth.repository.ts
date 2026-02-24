import User from "../models/user.model";


export class AuthRepository {
  findUserByEmail(email: any) {
    throw new Error("Method not implemented.");
  }
  static findByEmail(email: string) {
    return User.findOne({ email });
  }

  static createUser(data: any) {
    return User.create(data);
  }
   static async findById(id: string) {
    return User.findById(id);
  }
}
