import { Router } from "express";
import {
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

export default router;
