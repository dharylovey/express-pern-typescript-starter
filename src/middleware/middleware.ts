import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next) => {
  try {
    console.log(req.body, req.headers, req.params, req.query);
    next();
  } catch (error) {
    next(error);
  }
};
