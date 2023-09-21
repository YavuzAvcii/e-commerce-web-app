const routeRemember = (req, res, next) => {
  res.locals.lastRoute = req.baseUrl;
  next();
};

module.exports = routeRemember;
