import User from "../models/user.model";

export const createUser = async (req: any, res: any) => {
  const image = req.file ? req.file.filename : null;

  const user = await User.create({
    ...req.body,
    image,
  });

  res.json(user);
};

export const getUsers = async (_: any, res: any) => {
  const users = await User.find();
  res.json(users);
};

export const getUser = async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

export const updateUser = async (req: any, res: any) => {
  const image = req.file ? req.file.filename : undefined;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(image && { image }),
    },
    { new: true }
  );

  res.json(user);
};

export const deleteUser = async (req: any, res: any) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
