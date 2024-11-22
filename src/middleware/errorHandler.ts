import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH ${req.path}`, err);
  if (err instanceof Error) {
    try {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    } catch (error) {
      next(error);
    }
  }

  try {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } catch (error) {
    next(error);
  }
};
