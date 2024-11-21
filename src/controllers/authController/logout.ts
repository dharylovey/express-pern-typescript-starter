import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth_token");
  res.status(200).json({ success: true, message: "Logout successful" });
};
