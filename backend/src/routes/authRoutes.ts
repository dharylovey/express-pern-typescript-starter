import { NextFunction, Request, Response, Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/authController";

const router: Router = Router();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

router.post("/logout", logout);

router.post("/verify-email", asyncHandler(verifyEmail));

router.post("/forgot-password", asyncHandler(forgotPassword));

export default router;
