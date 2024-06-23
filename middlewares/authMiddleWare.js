const { validateToken } = require("../services/authentication");

const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      // return res.redirect("/user/signin");
      return next();
    }
    try {
      const userPayload = validateToken(token);
      // console.log(userPayload);
      req.user = userPayload;
    } catch (e) {

    }
    return next();
  };
};


module.exports = { checkForAuthenticationCookie };