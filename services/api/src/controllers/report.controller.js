import taskHelper from '../helpers/task.helper';

/**
 * This is a protected route. Will generate report only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function generate(req, res) {
  taskHelper.create({
    from: req.body.from,
    to: req.body.to,
    format: req.body.format,
  }).then(
    (job) => {
      const message = `Job ${job.id} saved to the ${job.type} queue.`;
      console.log(message);
      return res.json({ message });
    },
    (error) => console.log(error.message),
  );
}

export default { generate };
