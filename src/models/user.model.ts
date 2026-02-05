import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;          // your existing field
  firstName?: string;     // sir-style
  lastName?: string;      // sir-style
  username?: string;      // sir-style
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "user";
  image?: string;         // your existing field
  imageUrl?: string;      // sir-style
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    // ✅ YOUR EXISTING FIELD (DO NOT REMOVE)
    name: {
      type: String,
    },

    // ➕ SIR-STYLE FIELDS (OPTIONAL, SAFE)
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined without breaking uniqueness
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
  type: String,
  required: true,
  unique: true, 
},


    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    
    image: {
      type: String,
    },

    // ➕ SIR-STYLE FIELD
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
