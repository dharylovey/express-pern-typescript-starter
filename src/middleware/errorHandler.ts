import { statusCode } from "@/constant/httpStatusCode";
import { ErrorRequestHandler } from "express";
import z from "zod";
import { Response } from "express";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(statusCode.BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

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
    if (err instanceof z.ZodError) {
      handleZodError(res, err);
    }
  } catch (error) {
    next(error);
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
