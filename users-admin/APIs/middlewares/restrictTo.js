// restrictTo alway will be used after auth middleware

const APIError = require("../utils/apiError");

// restrictTo is a higher order function that takes a role and returns a middleware function
const restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      throw new APIError("You are not authorized to access this resource", 403);
    }
    next();
  };
};

module.exports = restrictTo;
