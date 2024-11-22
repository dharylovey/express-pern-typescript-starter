import { ErrorCode, SuccessCode, VerifyCode } from "@/constant/responseMessage";
import { BAD_REQUEST, OK } from "@/constant/httpStatusCode";
import { comparePassword } from "@/lib/bcrypt";
import { getUserByEmail } from "@/lib/user";
import catchErrors from "@/utils/catchErrors";
import { generateTokenSetCookie } from "@/utils/token";
import { UserSchema, loginSchema } from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";

export const login = catchErrors(async (req: Request, res: Response) => {
  const data: UserSchema = req.body;
  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success)
    return res
      .status(BAD_REQUEST)
      .json({ success: false, message: ErrorCode.InvalidEmail });

  const { email, password } = validatedData.data;

  const userExist = await getUserByEmail(email);

  if (!userExist || !userExist.password || !userExist.email) {
    return res
      .status(BAD_REQUEST)
      .json({ success: false, message: ErrorCode.InvalidEmail });
  }

  if (!userExist.isVerified) {
    return res
      .status(BAD_REQUEST)
      .json({ success: false, message: VerifyCode.VerifyEmail });
  }

  const user = await comparePassword(password, userExist.password);
  if (!user) {
    return res
      .status(BAD_REQUEST)
      .json({ success: false, message: ErrorCode.InvalidPassword });
  }

  await generateTokenSetCookie(res, userExist.id);

  const newUser = {
    userId: userExist.id,
    email: userExist.email,
    isVerified: userExist.isVerified,
  };

  return res.status(OK).json({
    success: true,
    message: SuccessCode.LoginSuccess,
    data: newUser,
  });
});
