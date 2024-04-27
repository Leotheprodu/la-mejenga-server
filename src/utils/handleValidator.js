import { validationResult } from 'express-validator';

const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    console.error(err);
    res.status(422);
    res.send({
      error: err.array(),
      message: 'Revisa que los datos sean correctos',
    });
  }
  return null;
};
export default validateResults;
