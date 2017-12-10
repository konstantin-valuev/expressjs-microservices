import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import authController from '../controllers/auth.controller';

const router = express.Router();

/** POST /login - Returns token if correct username and password are provided */
router.route('/login')
  .post(validate(paramValidation.login), authController.login);

export default router;
