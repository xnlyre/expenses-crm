require("dotenv").config();
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    name: { name: user.name },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Email or password is incorrect");
  }
  const token = user.createJWT();
  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, id: user._id }, token });
};

const getUsers = async (req, res) => {
  const users = await User.find({});

  res.status(StatusCodes.OK).json({ users });
};

module.exports = {
  register,
  getUsers,
  login,
};
