import Joi from 'joi';

export default {

  // POST /login
  login: {
    body: {
      login: Joi.string().required().min(1).max(24),
      pass: Joi.string().required().min(5).max(24),
    }
  },

  // POST /generate
  generateReport: {
    body: {
      from: Joi.date().required().iso(),
      to: Joi.date().required().iso(),
      format: Joi.string().required().valid(['pdf', 'csv', 'xls']),
    }
  },
};
