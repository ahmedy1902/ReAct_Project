const myOwnMiddleware = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const now = new Date();
  console.log(`${method} ${path} ${now}`);
  next();
};

module.exports = myOwnMiddleware;
