const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  name: {
    type: String,
    required: [true, "Name is required"],
  },

  avatarURL: String,

  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

const joiSchemaSignup = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required",
  }),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
});

const joiSchemaSignin = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

module.exports = {
  User,
  joiSchemaSignup,
  joiSchemaSignin,
};
