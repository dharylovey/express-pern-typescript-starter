const enum ErrorCode {
  InvalidEmail = "Invalid email or password",
  UserExist = "User already exists",
  UserNotFound = "User not found",
  InvalidVerificationCode = "Invalid or Expired verification code",
  InvalidPassword = "Invalid email or password",
  PasswordNotMatch = "Password not match",
}

const enum SuccessCode {
  UserCreated = "User created successfully",
  UserVerified = "User verified successfully",
  UserPasswordReset = "User password reset successfully",
  UserPasswordChanged = "User password changed successfully",
  UserLogout = "User logout successfully",
  UserDeleted = "User deleted successfully",
  PasswordReset = "Password reset link sent to your email",
  LoginSuccess = "Login successful",
}

const enum VerifyCode {
  InvalidVerificationCode = "Invalid or Expired verification code",
  InvalidVerification = "Invalid verification code",
  VerifyEmail = "Please verify your email",
  EmailSuccessVerified = "Email successfully verified",
}

export { ErrorCode, SuccessCode, VerifyCode };
