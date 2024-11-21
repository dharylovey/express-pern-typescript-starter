import { comparePassword } from "@/lib/bcrypt";
import { getUserByEmail } from "@/lib/user";
import { generateTokenSetCookie } from "@/utils/token";
import { UserSchema, loginSchema } from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";
import z from "zod";

export const login = async (req: Request, res: Response) => {
  const data: UserSchema = req.body;
  const validatedData = loginSchema.safeParse(data);

  try {
    if (!validatedData.success)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const { email, password } = validatedData.data;

    const userExist = await getUserByEmail(email);

    if (!userExist || !userExist.password || !userExist.email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!userExist.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify your email" });
    }

    const user = await comparePassword(password, userExist.password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    await generateTokenSetCookie(res, userExist.id);

    const newUser = {
      userId: userExist.id,
      email: userExist.email,
      isVerified: userExist.isVerified,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
