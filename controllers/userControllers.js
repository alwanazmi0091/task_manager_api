import User from "../models/userModels.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (
    !email ||
    !name ||
    !password ||
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    name.trim() === "" ||
    password.trim() === ""
  ) {
    const error = new Error("Invalid fields");
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();

  const isEmailExist = await User.findByEmail(normalizedEmail);
  if (isEmailExist !== null) {
    const error = new Error("Email already used");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    email: normalizedEmail,
    name: normalizedName,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "Account successfully created",
    createdId: result,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  const user = await User.findByEmail(email);

  if (!user) {
    const error = new Error("Incorrect username or password");
    error.status = 400;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Incorrect username or password");
    error.status = 400;
    throw error;
  }

  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  req.session.userId = user.user_id;

  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    },
  });
};

const logout = async (req, res) => {
  await new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  res.clearCookie("sessionId", {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

const editUser = async (req, res) => {
  const allowedFields = ["email", "name"];

  const isInvalidLoad =
    Object.keys(req.body).some((key) => !allowedFields.includes(key)) ||
    Object.values(req.body).some((value) => typeof value !== "string");

  if (isInvalidLoad) {
    const error = new Error("Invalid body request");
    error.status = 400;
    throw error;
  }

  const id = req.session.userId;
  const fields = { ...req.body };

  const isIdExist = await User.findById(id);
  if (!isIdExist) {
    const error = new Error("User doesn't exist");
    error.status = 404;
    throw error;
  }

  await User.edit(id, fields);

  return res.status(200).json({
    message: "Data updated successfully",
  });
};

const deleteUser = async (req, res) => {
  const id = req.session.userId;

  const isIdExist = await User.findById(id);
  if (!isIdExist) {
    const error = new Error("Error doesn't exist");
    error.status = 404;
    throw error;
  }

  await User.delete(id);

  await new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  res.clearCookie("sessionId", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Account successfully deleted",
  });
};

const getUser = async (req, res) => {
  const id = req.session.userId;

  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User doesn't exist");
    error.status = 404;
    throw error;
  }

  return res.status(200).json(user);
};

export { register, login, logout, editUser, deleteUser, getUser };
