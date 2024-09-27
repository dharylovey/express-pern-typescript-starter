import { Router } from "express";
import {
    forgotPassword,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/authController";

const router: Router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

export default router;
