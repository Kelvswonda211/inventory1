const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // to handle ma error ma msg
  res.json({
    message: err.message,
    stack : process.env.NODE_ENV === "development" ? err.stack : null
  });
};

module.exports = errorHandler;
