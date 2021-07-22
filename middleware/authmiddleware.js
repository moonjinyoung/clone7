const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, "my-secret-key");

    user.findByPk(userId).then((user) => {
      res.locals.user = user;
      console.log('pleaseeeeeee', user, res.locals.user)
      next();
    });
  } catch (error) {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
};
