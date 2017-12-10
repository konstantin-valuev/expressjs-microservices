import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';

// sample user, used for authentication
const user = {
  username: 'admin',
  password: 'admin'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  if (req.body.login === user.username && req.body.pass === user.password) {
    const token = jwt.sign({
      username: user.login
    }, config.jwtSecret);
    return res.json({
      token,
    });
  }

  const err = new Error('Invalid login or pass');
  err.status = httpStatus.UNAUTHORIZED;
  return next(err);
}

export default { login };
