import { Request, Response, NextFunction } from 'express';

const asyncWrapper = (handler: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncWrapper;