import { sendWelcomeEmail } from "@/lib/email";
import { getVerificationCode, updateVerificationCode } from "@/lib/user";
import {
  VerifyEmailSchema,
  verifyEmailSchema,
} from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";
import z from "zod";

export const verifyEmail = async (req: Request, res: Response) => {
  const data: VerifyEmailSchema = req.body;
  const validatedData = verifyEmailSchema.safeParse(data);

  //validate data
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code",
    });
  }

  const { code } = validatedData.data;
  try {
    const user = await getVerificationCode(code);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired verification code ",
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

    return res.status(200).json({
      success: true,
      message: "Email successfully verified",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
