import { BAD_REQUEST, OK } from "@/constant/httpStatusCode";
import { VerifyCode } from "@/constant/responseMessage";
import { sendWelcomeEmail } from "@/lib/email";
import { getVerificationCode, updateVerificationCode } from "@/lib/user";
import catchErrors from "@/utils/catchErrors";
import {
  VerifyEmailSchema,
  verifyEmailSchema,
} from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";

export const verifyEmail = catchErrors(async (req: Request, res: Response) => {
  const data: VerifyEmailSchema = req.body;
  const validatedData = verifyEmailSchema.safeParse(data);

  //validate data
  if (!validatedData.success) {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: VerifyCode.InvalidVerification,
    });
  }

  const { code } = validatedData.data;
  const user = await getVerificationCode(code);

  if (!user) {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: VerifyCode.InvalidVerificationCode,
    });
  }

  const updatedUser = await updateVerificationCode(user.id);

  // Send Welcome Email
  await sendWelcomeEmail(updatedUser.email);

  const newUser = {
    userId: updatedUser.id,
    email: updatedUser.email,
    verificationCode: updatedUser.verificationCode,
    verificationCodeExpires: updatedUser.verificationCodeExpires,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };

  return res.status(OK).json({
    success: true,
    message: VerifyCode.EmailSuccessVerified,
    data: newUser,
  });
});
