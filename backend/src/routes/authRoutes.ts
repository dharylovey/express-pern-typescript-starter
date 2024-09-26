import { Router } from "express";
import { login, logout, register } from "../controllers/authController";

const router: Router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

export default router;
