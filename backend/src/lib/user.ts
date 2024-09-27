import prisma from "./prisma";

// Get user by email
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
export const checkExistsEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: false,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// Create User in Database
export const createUser = async (
  email: string,
  password: string,
  verificationCode: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    },
  });

  return user;
};

export const getVerificationCode = async (code: string) => {
  const user = await prisma.user.findFirst({
    where: {
      verificationCode: code,
    },
    select: {
      verificationCode: true,
      verificationCodeExpires: true,
      isVerified: true,
      id: true,
    },
  });
  return user;
};

export const updateVerificationCode = async (id: string) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
    },
    select: {
      id: true,
      email: true,
      isVerified: true,
      verificationCode: true,
      verificationCodeExpires: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const updateEmailPassword = async (
  id: string,
  resetToken: string,
  resetTokenExpires: Date
) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    },
    select: {
      id: true,
      email: true,
      resetPasswordToken: true,
      resetPasswordExpires: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
