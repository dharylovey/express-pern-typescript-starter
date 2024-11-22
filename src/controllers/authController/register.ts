import { hashPassword } from "@/lib/bcrypt";
import { sendVerificationEmail } from "@/lib/email";
import { checkExistsEmail, createUser } from "@/lib/user";
import catchErrors from "@/utils/catchErrors";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { UserSchema, registerSchema } from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";

export const register = catchErrors(async (req: Request, res: Response) => {
  const data: UserSchema = req.body;
  const validatedData = registerSchema.safeParse(data);

  // Validate data
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const { email, password, confirmPassword } = validatedData.data;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({
      Success: false,
      message: "Passwords do not match",
    });
  }

  // Check if user already exists
  const userExist = await checkExistsEmail(email);

  if (userExist) {
    return res
      .status(400)
      .json({ Success: false, message: "User already exists" });
  }

  // Hash password
  const hashPW = await hashPassword(password);

  // Generate verification code
  const verificationCode = generateVerificationCode();

  // Save user to database
  const user = await createUser(email, hashPW, verificationCode);

  const newUser = {
    userId: user.id,
    email: user.email,
    verificationCode,
    verificationCodeExpires: user.verificationCodeExpires,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Send verification email
  await sendVerificationEmail(user.email, verificationCode);

  return res.status(200).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});
