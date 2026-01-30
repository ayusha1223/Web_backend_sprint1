import User from "../models/user.model";

export const createUser = async (req: any, res: any) => {
  try {
    const image = req.file ? req.file.filename : null;

    const user = await User.create({
      ...req.body,
      image,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const getUsers = async (_: any, res: any) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUser = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
