const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized, BadRequest } = require("http-errors");
const { joiSchemaSignup, joiSchemaSignin } = require("../models/user");

module.exports = {
  signup: async (req, res, next) => {
    const { error } = joiSchemaSignup.validate(req.body);
    const { email, password, name } = req.body;

    if (error) {
      throw new BadRequest(error.message);
    }

    const isUserRegistered = await User.findOne({ email });
    if (isUserRegistered) {
      throw new Conflict("this user already exists");
    }

    const newUser = new User({ email, name, avatarURL: null });
    newUser.setPassword(password);
    const result = await newUser.save();

    const { email: usrEmail, name: usrName } = result;

    res.status(201).json({
      user: {
        email: usrEmail,
        name: usrName,
      },
    });
  },

  signin: async (req, res, next) => {
    const { email, password } = req.body;

    const { error } = joiSchemaSignin.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password)) {
      throw new Unauthorized("Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, "SECRET_KEY");

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
        avatar: user.avatarURL,
      },
    });
  },

  logout: async (req, res, next) => {
    const { id: userId } = req.user;
    await User.findByIdAndUpdate(userId, { token: null });

    res.status(204).json();
  },

  getCurrentUsr: async (req, res, next) => {
    const { id: userId } = req.user;
    const user = await User.findById(userId);

    res.status(200).json({
      email: user.email,
      name: user.name,
      id: user._id,
      avatar: user.avatarURL,
    });
  },
};
