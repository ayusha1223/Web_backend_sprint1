import z from "zod";

/* ===============================
   BASE USER SCHEMA
================================ */
const UserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).or(z.literal("")).optional(),
  role: z.enum(["admin", "user"]).optional(),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
});

/* ===============================
   ADMIN CREATE USER DTO
   Used in: /api/admin/users
================================ */
export const AdminCreateUserDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).optional(),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
});

export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

/* ===============================
   REGISTER USER DTO (Public)
   Used in: /api/auth/register
================================ */
export const RegisterUserDTO = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    phone: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

/* ===============================
   LOGIN USER DTO
================================ */
export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

/* ===============================
   UPDATE USER DTO
================================ */
export const UpdateUserDTO = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;