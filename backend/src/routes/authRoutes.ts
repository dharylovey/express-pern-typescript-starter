import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/authController";

const router: Router = Router();

router.post("/register", (req, res, next) => {
  register(req, res).then((res) => next(res));
});
router.post("/login", (req, res, next) => {
  login(req, res).then((res) => next(res));
});

router.post("/logout", logout);

router.post("/verify-email", (req, res, next) => {
  verifyEmail(req, res).then((res) => next(res));
});

router.post("/forgot-password", (req, res, next) => {
  forgotPassword(req, res).then((res) => next(res));
});

export default router;
