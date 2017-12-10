import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import reportController from '../controllers/report.controller';
import config from '../config';

const router = express.Router();

/** POST /generate - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/generate')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.generateReport),
    reportController.generate
  );

export default router;
