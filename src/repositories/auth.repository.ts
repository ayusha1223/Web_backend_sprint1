import { User } from "../models/user.model";

export class AuthRepository {
  static findByEmail(email: string) {
    return User.findOne({ email });
  }

  static createUser(data: any) {
    return User.create(data);
  }
}
