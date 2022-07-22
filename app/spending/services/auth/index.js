'use strict';

const jwt = require('jsonwebtoken');
const { authConfig } = require('../../configs');

const loginUser = async (data) => {
  const token = jwt.sign(
    {
      id: data.id,
      name: data.name,
      email: data.email,
    },
    authConfig.tokenPrivateKey,
    {
      algorithm: "HS256",
      expiresIn: authConfig.login_token_ttl,
    }
  );
  console.log('token ', token);
  return token;
}

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401);
    res.send({
      metadata: { http_code: 401 },
      error: { message: 'invalid_access_token' },
    });
  } else {
    let currentUser;
    try {
      // Parse the JWT string and store the result in `payload`.
      // Note that we are passing the key in this method as well. This method will throw an error
      // if the token is invalid (if it has expired according to the expiry time we set on sign in),
      // or if the signature does not match
      currentUser = jwt.verify(token, authConfig.tokenPrivateKey);
      req.currentUser = currentUser;
      next();
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        res.status(401);
        res.send({
          metadata: { http_code: 401 },
          error: { message: 'invalid_access_token' },
        });
      } else {
        // otherwise, return a bad request error
        res.status(401);
        res.send({
          metadata: { http_code: 400 },
          error: { message: 'bad_request' },
        });
      }
    }
  }
};

module.exports = {
  loginUser,
  authenticateUser,
};
