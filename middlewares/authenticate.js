const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Unauthorized("Invalid token");
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Invalid token");
  }

  try {
    const { id } = jwt.verify(token, "SECRET_KEY");
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new Unauthorized("Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
