import z from "zod";


const UserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "user"]).optional(),
  imageUrl: z.string().optional(),
});

/**
 * CREATE USER (Admin / Register extension)
 */
export const CreateUserDTO = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.enum(["admin", "user"]).optional(),
    imageUrl: z.string().optional(),
    phone: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

/**
 * LOGIN USER (Admin / alt login usage)
 */
export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

/**
 * UPDATE USER (Profile / Admin update)
 */
export const UpdateUserDTO = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
