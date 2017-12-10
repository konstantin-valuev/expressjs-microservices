import express from 'express';
import authRoutes from './auth.route';
import reportRoutes from './report.route';

const router = express.Router();

/** GET /test - Check api */
router.get('/test', (req, res) =>
  res.send('OK')
);

/** should be router.use('/auth', authRoutes);
 * but it does not correspond to the condition of the test task */
// mount auth routes at /auth
router.use('/', authRoutes);
/** should be router.use('/reports', reportRoutes);
 * but it does not correspond to the condition of the test task */
// mount report routes at /reports
router.use('/', reportRoutes);

export default router;
