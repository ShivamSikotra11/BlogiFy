const jwt = require('jsonwebtoken');
const secretKey = 'Blog-App-$75$';

const createToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    name:user.fullName,
    profileImageURL: user.profileImageURL,
    role:user.role,
  }
  const token = jwt.sign(payload, secretKey, {
    expiresIn: 60 * 60 * 24,
  });
  return token;
}

const validateToken = (token)=>{
 const payload = jwt.verify(token, secretKey);
  return payload;
}

module.exports = { createToken, validateToken };