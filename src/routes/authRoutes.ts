import { forgotPassword } from "@/controllers/authController/forgotPassword";
import { login } from "@/controllers/authController/login";
import { logout } from "@/controllers/authController/logout";
import { register } from "@/controllers/authController/register";
import { verifyEmail } from "@/controllers/authController/verifyEmail";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));

router.post("/logout", logout);

router.post("/verify-email", asyncHandler(verifyEmail));

router.post("/forgot-password", asyncHandler(forgotPassword));

export default router;
