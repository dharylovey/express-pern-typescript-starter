import { OK } from "@/constant/httpStatusCode";
import { SuccessCode } from "@/constant/responseMessage";
import catchErrors from "@/utils/catchErrors";
import { Request, Response } from "express";

export const logout = catchErrors(async (req: Request, res: Response) => {
  res.clearCookie("auth_token");
  res.status(OK).json({ success: true, message: SuccessCode.UserLogout });
});
