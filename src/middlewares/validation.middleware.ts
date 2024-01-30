import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import * as express from 'express';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
